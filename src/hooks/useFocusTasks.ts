
import { useState, useEffect } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { Task } from '@/types/task';

export function useFocusTasks(inFocusMode: boolean) {
  const { getTasksByPriority } = useTaskStore();
  const [focusTaskOrder, setFocusTaskOrder] = useState<Task[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get tasks and initialize focus mode session if needed
  useEffect(() => {
    // If we're in focus mode but don't have tasks loaded yet
    if (inFocusMode && focusTaskOrder.length === 0) {
      const openTasks = getTasksByPriority().filter(task => task.status === 'open');
      setFocusTaskOrder(openTasks);
      setCurrentIndex(0);
    }
  }, [inFocusMode, focusTaskOrder.length, getTasksByPriority]);
  
  // Reset focus session when leaving focus mode
  useEffect(() => {
    if (!inFocusMode) {
      setFocusTaskOrder([]);
      setCurrentIndex(0);
    }
  }, [inFocusMode]);
  
  // Get the current task based on the index
  const currentTask = focusTaskOrder[currentIndex];
  
  // Move to the next task
  const moveToNextTask = () => {
    if (currentIndex < focusTaskOrder.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      return true;
    }
    return false;
  };
  
  // Return to top task
  const returnToTop = () => {
    setCurrentIndex(0);
  };
  
  return {
    focusTaskOrder,
    currentTask,
    currentIndex,
    moveToNextTask,
    returnToTop
  };
}
