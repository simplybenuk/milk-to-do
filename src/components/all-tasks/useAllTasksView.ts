
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
  const openTasks = tasks.filter(task => 
    task.status === 'open' && 
    // Ensure expiry_date is valid and greater than or equal to the current date
    new Date(task.expiry_date) >= new Date() &&
    // Filter by selected tags if any and if Pro user
    (selectedTagIds.length === 0 || 
      task.tags?.some(tagId => selectedTagIds.includes(tagId)))
  );
  
  // Get relevant parents for the filtered open tasks
  const relevantParents = tasks.filter(task => 
    task.status === 'closed' && 
    task.closed_status === 'parent' &&
    openTasks.some(childTask => childTask.parent_id === task.id)
  );
  
  // Filter out child tasks from the open tasks list 
  // so we don't show them as individual cards
  const topLevelOpenTasks = openTasks.filter(task => !task.parent_id);

  const handleViewParent = (parentId: string) => {
    const parentTask = [...openTasks, ...relevantParents].find(t => t.id === parentId);
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
    relevantParents,
    focusParentId,
    setFocusParentId,
    handleViewParent
  };
}
