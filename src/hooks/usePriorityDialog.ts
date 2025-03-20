
import { useState, useRef } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';

export function usePriorityDialog() {
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const taskToSplitRef = useRef<Task | null>(null);
  
  const { updateTaskPriority } = useTaskStore();
  const { toast } = useToast();

  const openPriorityDialog = (task: Task) => {
    // Store the current task for reference
    taskToSplitRef.current = task;
    // Make sure to set the dialog to open
    setShowPriorityDialog(true);
    console.log("Opening priority dialog for task:", task.title);
  };

  const handleDowngradePriority = async () => {
    if (!taskToSplitRef.current) return;
    
    const currentTask = taskToSplitRef.current;
    const newPriority = currentTask.priority === 'high' ? 'medium' : 'low';
    
    await updateTaskPriority(currentTask.id, newPriority);
    
    toast({
      title: "Priority Updated",
      description: `Task priority changed to ${newPriority}`,
    });
    
    // Clear the task reference after handling priority change
    setShowPriorityDialog(false);
  };

  const handleBlocked = () => {
    toast({
      description: "Moving to next task without updating priority",
    });
    // Clear the task reference after handling blocked status
    setShowPriorityDialog(false);
  };

  const handleSplitTask = () => {
    setShowPriorityDialog(false);
    setShowSplitDialog(true);
  };

  const handleSplitComplete = () => {
    // Reset reference after completing split
    taskToSplitRef.current = null;
    setShowSplitDialog(false);
  };

  // Add a cleanup method for proper reset
  const resetDialogState = () => {
    if (showPriorityDialog || showSplitDialog) {
      console.log("Resetting dialog state");
    }
    taskToSplitRef.current = null;
    setShowPriorityDialog(false);
    setShowSplitDialog(false);
  };

  return {
    showPriorityDialog,
    setShowPriorityDialog,
    showSplitDialog,
    setShowSplitDialog,
    taskToSplit: taskToSplitRef.current,
    openPriorityDialog,
    handleDowngradePriority,
    handleBlocked,
    handleSplitTask,
    handleSplitComplete,
    resetDialogState
  };
}
