
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTaskProcessingState } from './useTaskProcessingState';

export function useTaskReturnAction() {
  const { toast } = useToast();
  const { isProcessing } = useTaskProcessingState();
  
  const handleReturnToTop = useCallback((returnToTop: () => void) => {
    if (isProcessing) return;
    returnToTop();
    toast({
      description: "Returned to top priority task",
    });
  }, [isProcessing, toast]);
  
  return {
    handleReturnToTop
  };
}
