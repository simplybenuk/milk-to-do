
import { useState, useCallback } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';

export function useTaskActions(onFocusEnd: () => void) {
  const { completeTask, incrementSkipCount } = useTaskStore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle task completion
  const handleComplete = useCallback(async (
    taskId: string, 
    moveToNextTask: () => boolean
  ) => {
    if (isProcessing || !taskId) return;
    
    try {
      setIsProcessing(true);
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
      setIsProcessing(false);
    }
  }, [completeTask, toast, isProcessing, onFocusEnd]);
  
  // Handle task skip
  const handleSkip = useCallback(async (
    taskId: string | undefined,
    moveToNextTask: () => boolean
  ) => {
    if (isProcessing || !taskId) return;
    
    try {
      setIsProcessing(true);
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
      setIsProcessing(false);
    }
  }, [incrementSkipCount, toast, isProcessing, onFocusEnd]);
  
  // Handle return to top
  const handleReturnToTop = useCallback((returnToTop: () => void) => {
    if (isProcessing) return;
    returnToTop();
    toast({
      description: "Returned to top priority task",
    });
  }, [isProcessing, toast]);
  
  return {
    handleComplete,
    handleSkip,
    handleReturnToTop,
    isProcessing
  };
}
