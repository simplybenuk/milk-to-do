
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import useTaskStore from '@/stores/useTaskStore';
import { useSubscription } from '@/hooks/useSubscription';
import { FetchTasksOptions } from '@/stores/actions/tasks/fetchTasks';

export function useAllTasksView() {
  const { tasks, fetchTasks, isLoading, totalTaskCount } = useTaskStore();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [focusParentId, setFocusParentId] = useState<string | null>(null);
  const { isPro } = useSubscription();
  const [page, setPage] = useState(0);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
  
  // Get tag filters from URL
  const selectedTagIds = isPro ? searchParams.get('tags')?.split(',') || [] : [];
  
  // Optimize task loading with pagination and filtering
  const loadTasks = useCallback(async (refresh = false) => {
    console.log('Loading tasks for all tasks view, refresh:', refresh);
    
    const options: FetchTasksOptions = {
      // Only get open tasks for the main view
      status: 'open',
      // Use pagination
      page: refresh ? 0 : page,
      pageSize: 20, // Load 20 tasks at a time
      // Apply tag filtering if user is Pro and has tags selected
      tags: isPro && selectedTagIds.length > 0 ? selectedTagIds : undefined
    };
    
    try {
      await fetchTasks(options);
      
      if (refresh) {
        setPage(0);
      }
      
      setHasLoadedInitialData(true);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: 'Error loading tasks',
        description: 'Please try refreshing the page',
        variant: 'destructive',
      });
    }
  }, [fetchTasks, page, isPro, selectedTagIds, toast]);
  
  // Load more tasks when the user scrolls to the bottom
  const loadMoreTasks = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);
  
  // Load initial data
  useEffect(() => {
    if (!hasLoadedInitialData) {
      loadTasks(true);
    }
  }, [loadTasks, hasLoadedInitialData]);
  
  // Load more data when page changes
  useEffect(() => {
    if (hasLoadedInitialData && page > 0) {
      loadTasks();
    }
  }, [page, loadTasks, hasLoadedInitialData]);
  
  // Refresh when tag filters change
  useEffect(() => {
    if (hasLoadedInitialData) {
      loadTasks(true);
    }
  }, [selectedTagIds, loadTasks, hasLoadedInitialData]);
  
  // Get all open tasks, excluding expired ones, including child tasks
  const openTasks = tasks.filter(task => {
    // Basic conditions for open tasks
    const isOpenAndNotExpired = 
      task.status === 'open' && 
      new Date(task.expiry_date) >= new Date();
    
    // If no tag filters or not Pro, just return basic condition
    if (!isPro || selectedTagIds.length === 0) {
      return isOpenAndNotExpired;
    }
    
    // If Pro and tags selected, filter by tags
    return isOpenAndNotExpired && 
      (task.tags?.some(tagId => selectedTagIds.includes(tagId)));
  });
  
  // Get parent tasks with child tasks (both open and closed parent tasks with open children)
  const parentTasks = tasks.filter(task => 
    task.closed_status === 'parent' &&
    task.child_task_ids?.length > 0 &&
    // Only include parent tasks that have at least one open child
    tasks.some(childTask => 
      task.child_task_ids.includes(childTask.id) && 
      childTask.status === 'open' &&
      new Date(childTask.expiry_date) >= new Date()
    )
  );

  // Find relevant parent tasks that are closed but have open children
  const relevantParents = parentTasks.filter(task => task.status === 'closed');
  
  // Find open parent tasks for direct inclusion in the main list
  const openParentTasks = parentTasks.filter(task => task.status === 'open');
  
  // Include all top-level tasks (non-child tasks) and open parent tasks
  const topLevelOpenTasks = [
    ...openTasks.filter(task => !task.parent_id), // Only non-child tasks
    ...openParentTasks // Open parent tasks
  ];

  // Get child tasks for display on the all tasks screen
  const childTasks = openTasks.filter(task => task.parent_id);

  const handleViewParent = (parentId: string) => {
    const parentTask = tasks.find(t => t.id === parentId);
    if (parentTask) {
      const parentElement = document.getElementById(`task-${parentId}`);
      if (parentElement) {
        parentElement.scrollIntoView({ behavior: 'smooth' });
        setFocusParentId(parentId);
        // Remove highlight after 2 seconds
        setTimeout(() => setFocusParentId(null), 2000);
      }
    } else {
      toast({
        title: "Parent task not found",
        description: "The parent task might have been deleted.",
        variant: "destructive"
      });
    }
  };

  return {
    openTasks,
    topLevelOpenTasks,
    parentTasks,
    relevantParents,
    childTasks,
    focusParentId,
    setFocusParentId,
    handleViewParent,
    isLoading,
    hasMore: tasks.length < (totalTaskCount || 0),
    loadMoreTasks,
    refreshTasks: () => loadTasks(true)
  };
}
