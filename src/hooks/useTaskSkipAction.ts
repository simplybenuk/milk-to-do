
import { useCallback } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { useTaskProcessingState } from './useTaskProcessingState';

export function useTaskSkipAction(onFocusEnd: () => void) {
  const { incrementSkipCount } = useTaskStore();
  const { toast } = useToast();
  const { isProcessing, startProcessing, stopProcessing } = useTaskProcessingState();
  
  const handleSkip = useCallback(async (
    taskId: string | undefined,
    moveToNextTask: () => boolean
  ) => {
    if (isProcessing || !taskId) return;
    
    try {
      startProcessing();
      await incrementSkipCount(taskId);
      
      // Move to next task if there is one
      const hasMoreTasks = moveToNextTask();
      if (!hasMoreTasks) {
        // No more tasks, end focus mode
        toast({
          description: "Focus session complete! All tasks have been processed.",
        });
        setTimeout(() => {
          onFocusEnd();
        }, 500);
      }
    } catch (error) {
      console.error('Error skipping task:', error);
      toast({
        title: "Error",
        description: "Failed to skip task. Please try again.",
        variant: "destructive"
      });
    } finally {
      stopProcessing();
    }
  }, [incrementSkipCount, toast, isProcessing, startProcessing, stopProcessing, onFocusEnd]);
  
  return {
    handleSkip,
    isProcessing
  };
}
