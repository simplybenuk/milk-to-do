
import { useCallback } from 'react';
import { useTaskCompletionAction } from './useTaskCompletionAction';
import { useTaskSkipAction } from './useTaskSkipAction';
import { useTaskReturnAction } from './useTaskReturnAction';

export function useTaskActions(onFocusEnd: () => void) {
  const { handleComplete, isProcessing: isCompletingTask } = useTaskCompletionAction(onFocusEnd);
  const { handleSkip, isProcessing: isSkippingTask } = useTaskSkipAction(onFocusEnd);
  const { handleReturnToTop } = useTaskReturnAction();
  
  // Combine processing states
  const isProcessing = isCompletingTask || isSkippingTask;
  
  return {
    handleComplete,
    handleSkip,
    handleReturnToTop,
    isProcessing
  };
}
