
import { useCallback } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { useTaskProcessingState } from './useTaskProcessingState';

export function useTaskCompletionAction(onFocusEnd: () => void) {
  const { completeTask } = useTaskStore();
  const { toast } = useToast();
  const { isProcessing, startProcessing, stopProcessing } = useTaskProcessingState();
  
  const handleComplete = useCallback(async (
    taskId: string, 
    moveToNextTask: () => boolean
  ) => {
    if (isProcessing || !taskId) return;
    
    try {
      startProcessing();
      await completeTask(taskId);
      
      toast({
        title: "Task completed",
        description: "Great job! The task has been marked as complete.",
      });
      
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
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive"
      });
    } finally {
      stopProcessing();
    }
  }, [completeTask, toast, isProcessing, startProcessing, stopProcessing, onFocusEnd]);
  
  return { 
    handleComplete,
    isProcessing
  };
}
