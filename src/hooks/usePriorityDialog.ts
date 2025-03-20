
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
    console.log("Opening priority dialog for task:", task.title);
    // Make sure we start with clean state
    taskToSplitRef.current = task;
    setShowPriorityDialog(true);
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
    
    closeDialog();
  };

  const handleBlocked = () => {
    toast({
      description: "Moving to next task without updating priority",
    });
    closeDialog();
  };

  const handleSplitTask = () => {
    setShowPriorityDialog(false);
    setShowSplitDialog(true);
  };

  const handleSplitComplete = () => {
    taskToSplitRef.current = null;
    setShowSplitDialog(false);
  };

  const closeDialog = () => {
    setShowPriorityDialog(false);
  };

  // Clear all dialog state
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
    resetDialogState,
    closeDialog
  };
}
