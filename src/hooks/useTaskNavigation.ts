
import { useState, useEffect, useCallback } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { usePriorityDialog } from './usePriorityDialog';
import { useTaskOrder } from './useTaskOrder';
import { useTaskSkipActions } from './useTaskSkipActions';
import { Task } from '@/types/task';

export function useTaskNavigation() {
  const { getTasksByPriority, incrementSkipCount, fetchTasks } = useTaskStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();
  
  // Get sorted tasks each time to ensure latest data
  const sortedOpenTasks = getTasksByPriority().filter(task => task.status === 'open');
  
  // Get the current task based on the index
  const currentTask = sortedOpenTasks[currentIndex];
  
  // Initialize state for skip in progress
  const [skipInProgress, setSkipInProgress] = useState(false);
  
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

  const {
    findNextTaskIndex,
    resetOriginalOrder
  } = useTaskOrder(sortedOpenTasks, skipInProgress);
  
  // Move to the next task while ensuring state is clean
  const moveToNextTask = useCallback(() => {
    // Clear any lingering dialogs first
    resetDialogState();
    
    // Update the index using the original order
    if (sortedOpenTasks.length === 0) {
      return;
    }
    
    if (currentTask) {
      const nextIndex = findNextTaskIndex(currentTask.id, currentIndex);
      setCurrentIndex(nextIndex);
      console.log(`Moved to task index: ${nextIndex}`);
    } else {
      // Fallback if there's no current task
      setCurrentIndex(prevIndex => (prevIndex + 1) % sortedOpenTasks.length);
    }
  }, [currentTask, resetDialogState, sortedOpenTasks.length, findNextTaskIndex, currentIndex]);

  // Using useCallback to memoize handleLowPrioritySkip for the dependency array
  const handleLowPrioritySkip = useCallback(async () => {
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
  }, [currentTask, skipInProgress, incrementSkipCount, fetchTasks, moveToNextTask, toast]);

  const {
    handleSkip,
    handleSkipAnyway
  } = useTaskSkipActions(
    currentTask,
    moveToNextTask,
    openPriorityDialog,
    resetDialogState,
    setShowPriorityDialog,
    skipInProgress,
    setSkipInProgress
  );
  
  // Adjust current index if it's out of bounds
  useEffect(() => {
    if (currentIndex >= sortedOpenTasks.length && sortedOpenTasks.length > 0) {
      setCurrentIndex(0);
    }
  }, [sortedOpenTasks.length, currentIndex]);

  // Handle "Return to top" button
  const handleReturnToTop = () => {
    if (skipInProgress) return;
    
    resetDialogState();
    setCurrentIndex(0);
    
    // Reset the original order when returning to top
    resetOriginalOrder();
    
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
      
      // Reset the original order after splitting a task
      resetOriginalOrder();
      
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
