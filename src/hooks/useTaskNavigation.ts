
import { useState, useEffect } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { usePriorityDialog } from './usePriorityDialog';

export function useTaskNavigation() {
  const { getTasksByPriority, incrementSkipCount, fetchTasks } = useTaskStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();
  
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
  
  // Get sorted tasks each time we need them to ensure we're using the latest data
  const sortedOpenTasks = getTasksByPriority().filter(task => task.status === 'open');
  
  // Use updated sortedOpenTasks to get the current task
  const currentTask = sortedOpenTasks[currentIndex];

  // Make sure we adjust the current index if it's out of bounds
  useEffect(() => {
    if (currentIndex >= sortedOpenTasks.length && sortedOpenTasks.length > 0) {
      setCurrentIndex(0);
    }
  }, [sortedOpenTasks.length, currentIndex]);

  // For "Skip Anyway" action - this will increment the skip count
  const handleSkipAnyway = async () => {
    if (!currentTask) return;
    
    try {
      console.log("Skipping anyway task:", currentTask.title);
      await incrementSkipCount(currentTask.id);
      await fetchTasks();
      
      toast({
        description: "Task skipped and skip count increased",
      });
      
      // Always close the dialog first, then move to next task
      setShowPriorityDialog(false);
      
      // Small delay to ensure UI updates properly before moving to next task
      setTimeout(() => {
        moveToNextTask();
      }, 50);
    } catch (error) {
      console.error("Error in handleSkipAnyway:", error);
      // Ensure dialog closes even on error
      setShowPriorityDialog(false);
    }
  };

  // Initial skip handler - decides whether to show dialog or directly handle skip
  const handleSkip = () => {
    if (!currentTask) return;
    
    console.log(`Handling skip for task: ${currentTask.title} with priority: ${currentTask.priority}`);
    
    // Reset dialog state first to ensure a clean state
    resetDialogState();
    
    if (currentTask.priority === 'high' || currentTask.priority === 'medium') {
      // For high or medium priority tasks, show the dialog
      openPriorityDialog(currentTask);
    } else {
      // For low priority tasks, directly increment skip count
      handleLowPrioritySkip();
    }
  };
  
  // Separate handler for low priority tasks to keep code clean
  const handleLowPrioritySkip = async () => {
    if (!currentTask) return;
    
    try {
      await incrementSkipCount(currentTask.id);
      await fetchTasks();
      moveToNextTask();
    } catch (error) {
      console.error("Error in handleLowPrioritySkip:", error);
    }
  };

  const moveToNextTask = () => {
    if (currentIndex >= sortedOpenTasks.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
    
    // After moving to the next task, always reset dialog state
    resetDialogState();
  };

  const handleReturnToTop = () => {
    setCurrentIndex(0);
    resetDialogState();
    toast({
      description: "Returned to top priority task",
    });
  };

  // Enhance handleSplitComplete to refresh tasks and reset the current index
  const enhancedHandleSplitComplete = () => {
    fetchTasks();
    setCurrentIndex(0);
    handleSplitComplete();
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
    handleDowngradePriority,
    handleBlocked,
    moveToNextTask,
    handleSplitComplete: enhancedHandleSplitComplete,
    handleSplitTask,
    taskToSplit,
    resetDialogState
  };
}
