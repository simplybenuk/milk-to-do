
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
    handleSplitComplete
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
    
    await incrementSkipCount(currentTask.id);
    await fetchTasks();
    moveToNextTask();
    
    toast({
      description: "Task skipped and skip count increased",
    });
  };

  // Initial skip handler - decides whether to show dialog or directly handle skip
  const handleSkip = async () => {
    if (!currentTask) return;
    
    if (currentTask.priority === 'high' || currentTask.priority === 'medium') {
      openPriorityDialog(currentTask);
    } else {
      // For low priority tasks, directly increment skip count
      await incrementSkipCount(currentTask.id);
      await fetchTasks();
      moveToNextTask();
    }
  };

  const moveToNextTask = () => {
    if (currentIndex >= sortedOpenTasks.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleReturnToTop = () => {
    setCurrentIndex(0);
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
    taskToSplit
  };
}
