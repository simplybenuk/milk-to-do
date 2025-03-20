
import { useState, useEffect, useCallback } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { usePriorityDialog } from './usePriorityDialog';
import { Task } from '@/types/task';

export function useTaskNavigation() {
  const { getTasksByPriority, incrementSkipCount, fetchTasks } = useTaskStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [skipInProgress, setSkipInProgress] = useState(false);
  const { toast } = useToast();
  
  // Get sorted tasks each time to ensure latest data
  const sortedOpenTasks = getTasksByPriority().filter(task => task.status === 'open');
  
  // Get the current task based on the index
  const currentTask = sortedOpenTasks[currentIndex];
  
  const {
    showPriorityDialog,
    setShowPriorityDialog,
    showSplitDialog,
    setShowSplitDialog,
    taskToSplit,
    openPriorityDialog,
    handleDowngradePriority,
    handleBlocked,
    handleSplitTask,
    handleSplitComplete,
    resetDialogState
  } = usePriorityDialog();
  
  // Adjust current index if it's out of bounds
  useEffect(() => {
    if (currentIndex >= sortedOpenTasks.length && sortedOpenTasks.length > 0) {
      setCurrentIndex(0);
    }
  }, [sortedOpenTasks.length, currentIndex]);

  // Move to the next task while ensuring state is clean
  const moveToNextTask = useCallback(() => {
    // Clear any lingering dialogs first
    resetDialogState();
    
    // Update the index
    if (sortedOpenTasks.length === 0) {
      return;
    }
    
    if (currentIndex >= sortedOpenTasks.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
    
    const nextIndex = currentIndex + 1 >= sortedOpenTasks.length ? 0 : currentIndex + 1;
    console.log(`Moved to task index: ${nextIndex}`);
  }, [currentIndex, resetDialogState, sortedOpenTasks.length]);

  // Handle low priority task skips (no dialog needed)
  const handleLowPrioritySkip = async () => {
    if (!currentTask || skipInProgress) return;
    
    try {
      setSkipInProgress(true);
      await incrementSkipCount(currentTask.id);
      await fetchTasks();
      moveToNextTask();
    } catch (error) {
      console.error("Error in handleLowPrioritySkip:", error);
      toast({
        title: "Error",
        description: "Failed to skip task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSkipInProgress(false);
    }
  };

  // "Skip Anyway" action for high/medium priority tasks
  const handleSkipAnyway = async () => {
    if (!currentTask || skipInProgress) return;
    
    try {
      setSkipInProgress(true);
      console.log("Skipping anyway task:", currentTask.title);
      
      // First close dialog
      setShowPriorityDialog(false);
      
      // Then perform skip actions
      await incrementSkipCount(currentTask.id);
      await fetchTasks();
      
      toast({
        description: "Task skipped and skip count increased",
      });
      
      // Move to next task after a short delay to ensure the dialog is fully closed
      setTimeout(() => {
        moveToNextTask();
        setSkipInProgress(false);
      }, 200);
    } catch (error) {
      console.error("Error in handleSkipAnyway:", error);
      setShowPriorityDialog(false);
      setSkipInProgress(false);
      
      toast({
        title: "Error",
        description: "Failed to skip task. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Initial skip handler - shows dialog for high/medium priority
  const handleSkip = useCallback(() => {
    if (!currentTask || skipInProgress) return;
    
    console.log(`Handling skip for task: ${currentTask.title} with priority: ${currentTask.priority}`);
    
    // Reset dialog state to ensure clean state
    resetDialogState();
    
    if (currentTask.priority === 'high' || currentTask.priority === 'medium') {
      // For high or medium priority tasks, show the dialog
      openPriorityDialog(currentTask);
    } else {
      // For low priority tasks, directly increment skip count
      handleLowPrioritySkip();
    }
  }, [currentTask, openPriorityDialog, resetDialogState, skipInProgress]);

  // Handle "Return to top" button
  const handleReturnToTop = () => {
    if (skipInProgress) return;
    
    resetDialogState();
    setCurrentIndex(0);
    
    toast({
      description: "Returned to top priority task",
    });
  };

  // Enhanced handleSplitComplete to refresh tasks and reset index
  const enhancedHandleSplitComplete = async () => {
    try {
      await fetchTasks();
      resetDialogState();
      setCurrentIndex(0);
      handleSplitComplete();
    } finally {
      setSkipInProgress(false);
    }
  };
  
  // Actions after priority change
  const handleDowngradePriorityAndMoveNext = async () => {
    try {
      setSkipInProgress(true);
      await handleDowngradePriority();
      
      // Use timeout to ensure state updates before moving
      setTimeout(() => {
        moveToNextTask();
        setSkipInProgress(false);
      }, 200);
    } catch (error) {
      console.error("Error in handleDowngradePriorityAndMoveNext:", error);
      setSkipInProgress(false);
    }
  };
  
  // Handle "Blocked" action
  const handleBlockedAndMoveNext = () => {
    try {
      setSkipInProgress(true);
      handleBlocked();
      
      setTimeout(() => {
        moveToNextTask();
        setSkipInProgress(false);
      }, 200);
    } catch (error) {
      console.error("Error in handleBlockedAndMoveNext:", error);
      setSkipInProgress(false);
    }
  };

  return {
    currentTask,
    currentIndex,
    sortedOpenTasks,
    showPriorityDialog,
    setShowPriorityDialog,
    showSplitDialog,
    setShowSplitDialog,
    handleSkip,
    handleSkipAnyway,
    handleReturnToTop,
    handleDowngradePriority: handleDowngradePriorityAndMoveNext,
    handleBlocked: handleBlockedAndMoveNext,
    moveToNextTask,
    handleSplitComplete: enhancedHandleSplitComplete,
    handleSplitTask,
    taskToSplit,
    resetDialogState,
    skipInProgress
  };
}
