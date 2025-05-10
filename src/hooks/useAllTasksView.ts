
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import useTaskStore from '@/stores/useTaskStore';
import { useSubscription } from '@/hooks/useSubscription';

export function useAllTasksView() {
  const { tasks } = useTaskStore();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [focusParentId, setFocusParentId] = useState<string | null>(null);
  const { isPro } = useSubscription();
  
  // Filter tasks by tags only if Pro user
  const selectedTagIds = isPro ? searchParams.get('tags')?.split(',') || [] : [];
  
  // Get all open tasks, excluding expired ones
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
  
  // Get parent tasks - both open parents and those marked as parents
  const parentTasks = tasks.filter(task => 
    task.closed_status === 'parent' &&
    task.status === 'open' && // Only include open parent tasks in the All Tasks view
    task.child_task_ids?.length > 0 &&
    // Only include parent tasks that have at least one open child
    tasks.some(childTask => 
      task.child_task_ids.includes(childTask.id) && 
      childTask.status === 'open' &&
      new Date(childTask.expiry_date) >= new Date()
    )
  );

  // Find relevant parent tasks that are closed but have open children
  const relevantParents = tasks.filter(task =>
    task.closed_status === 'parent' &&
    task.status === 'closed' && // These are closed parent tasks
    task.child_task_ids?.length > 0 &&
    // Only include if they have at least one open child
    tasks.some(childTask =>
      task.child_task_ids?.includes(childTask.id) &&
      childTask.status === 'open' &&
      new Date(childTask.expiry_date) >= new Date()
    )
  );
  
  // Include all tasks - both top-level and child tasks
  const topLevelOpenTasks = [...openTasks, ...parentTasks];

  const handleViewParent = (parentId: string) => {
    const parentTask = [...openTasks, ...parentTasks, ...relevantParents].find(t => t.id === parentId);
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
    focusParentId,
    setFocusParentId,
    handleViewParent
  };
}
