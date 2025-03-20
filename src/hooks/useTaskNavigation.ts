
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

  const handleSkip = async () => {
    if (!currentTask) return;
    
    await incrementSkipCount(currentTask.id);
    
    // After incrementing the skip count, we need to refresh the tasks
    // This ensures we get updated priority scores
    await fetchTasks();
    
    if (currentTask.priority === 'high' || currentTask.priority === 'medium') {
      openPriorityDialog(currentTask);
    } else {
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
    handleReturnToTop,
    handleDowngradePriority,
    handleBlocked,
    moveToNextTask,
    handleSplitComplete: enhancedHandleSplitComplete,
    handleSplitTask,
    taskToSplit
  };
}
