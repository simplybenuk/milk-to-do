
import { useCallback } from 'react';
import { useFocusTasks } from './useFocusTasks';
import { useTaskActions } from './useTaskActions';

export function useTaskNavigation(inFocusMode: boolean, onFocusEnd: () => void) {
  // Use our extracted hooks
  const {
    focusTaskOrder,
    currentTask,
    currentIndex,
    moveToNextTask,
    returnToTop
  } = useFocusTasks(inFocusMode);
  
  const {
    handleComplete: taskComplete,
    handleSkip: taskSkip,
    handleReturnToTop: taskReturnToTop,
    isProcessing
  } = useTaskActions(onFocusEnd);
  
  // Wrapper functions to connect the hooks
  const handleComplete = useCallback((taskId: string) => {
    return taskComplete(taskId, moveToNextTask);
  }, [taskComplete, moveToNextTask]);
  
  const handleSkip = useCallback(() => {
    return taskSkip(currentTask?.id, moveToNextTask);
  }, [taskSkip, currentTask, moveToNextTask]);
  
  const handleReturnToTop = useCallback(() => {
    return taskReturnToTop(returnToTop);
  }, [taskReturnToTop, returnToTop]);
  
  return {
    currentTask,
    currentIndex,
    focusTaskOrder,
    handleComplete,
    handleSkip,
    handleReturnToTop,
    isProcessing
  };
}
