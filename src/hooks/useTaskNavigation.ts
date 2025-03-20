
import { useState, useEffect, useCallback, useRef } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { usePriorityDialog } from './usePriorityDialog';
import { Task } from '@/types/task';

export function useTaskNavigation() {
  const { getTasksByPriority, incrementSkipCount, fetchTasks } = useTaskStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [skipInProgress, setSkipInProgress] = useState(false);
  // Add a ref to store the original task order
  const originalTaskOrderRef = useRef<string[]>([]);
  const { toast } = useToast();
  
  // Get sorted tasks each time to ensure latest data
  const sortedOpenTasks = getTasksByPriority().filter(task => task.status === 'open');
  
  // Update the original task order reference when not in a skip operation
  useEffect(() => {
    if (!skipInProgress && sortedOpenTasks.length > 0) {
      originalTaskOrderRef.current = sortedOpenTasks.map(task => task.id);
    }
  }, [sortedOpenTasks, skipInProgress]);
  
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

  // Find the next task index based on original order
  const findNextTaskIndex = useCallback((currentTaskId: string): number => {
    // If we don't have an original order yet, just increment the index
    if (originalTaskOrderRef.current.length === 0) {
      return (currentIndex + 1) % sortedOpenTasks.length;
    }
    
    // Find the current task's position in the original order
    const currentOrderIndex = originalTaskOrderRef.current.indexOf(currentTaskId);
    if (currentOrderIndex === -1 || currentOrderIndex >= originalTaskOrderRef.current.length - 1) {
      return 0; // If not found or at the end, go back to the first task
    }
    
    // Get the ID of the next task in the original order
    const nextTaskId = originalTaskOrderRef.current[currentOrderIndex + 1];
    
    // Find this task in the current sorted tasks
    const nextTaskIndex = sortedOpenTasks.findIndex(task => task.id === nextTaskId);
    return nextTaskIndex !== -1 ? nextTaskIndex : 0;
  }, [currentIndex, sortedOpenTasks]);

  // Move to the next task while ensuring state is clean
  const moveToNextTask = useCallback(() => {
    // Clear any lingering dialogs first
    resetDialogState();
    
    // Update the index using the original order
    if (sortedOpenTasks.length === 0) {
      return;
    }
    
    if (currentTask) {
      const nextIndex = findNextTaskIndex(currentTask.id);
      setCurrentIndex(nextIndex);
      console.log(`Moved to task index: ${nextIndex}`);
    } else {
      // Fallback if there's no current task
      setCurrentIndex(prevIndex => (prevIndex + 1) % sortedOpenTasks.length);
    }
  }, [currentTask, findNextTaskIndex, resetDialogState, sortedOpenTasks.length]);

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
      
      // Store the current task ID before skipping
      const currentTaskId = currentTask.id;
      
      // First close dialog
      setShowPriorityDialog(false);
      
      // Then perform skip actions
      await incrementSkipCount(currentTaskId);
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
    
    // Reset the original order when returning to top
    originalTaskOrderRef.current = sortedOpenTasks.map(task => task.id);
    
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
      originalTaskOrderRef.current = sortedOpenTasks.map(task => task.id);
      
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
