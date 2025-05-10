
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import useTaskStore from '@/stores/useTaskStore';
import { useSubscription } from '@/hooks/useSubscription';

export function useAllTasksView() {
  const { tasks, fetchTasks } = useTaskStore();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [focusParentId, setFocusParentId] = useState<string | null>(null);
  const { isPro } = useSubscription();
  
  // Add effect to refresh tasks when component is mounted
  useEffect(() => {
    // Refresh tasks to ensure we have the latest data including newly created child tasks
    fetchTasks();
  }, [fetchTasks]);
  
  // Filter tasks by tags only if Pro user
  const selectedTagIds = isPro ? searchParams.get('tags')?.split(',') || [] : [];
  
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
    childTasks, // Expose child tasks explicitly
    focusParentId,
    setFocusParentId,
    handleViewParent
  };
}
