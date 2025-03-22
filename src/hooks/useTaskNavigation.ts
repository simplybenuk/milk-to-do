
import { useState, useEffect, useCallback } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';

export function useTaskNavigation(inFocusMode: boolean, onFocusEnd: () => void) {
  const { getTasksByPriority, incrementSkipCount, completeTask, fetchTasks } = useTaskStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();
  
  // State for task order in focus mode
  const [focusTaskOrder, setFocusTaskOrder] = useState<Task[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
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
  
  // Handle task completion
  const handleComplete = useCallback(async (taskId: string) => {
    if (isProcessing || !inFocusMode) return;
    
    try {
      setIsProcessing(true);
      await completeTask(taskId);
      
      toast({
        title: "Task completed",
        description: "Great job! The task has been marked as complete.",
      });
      
      // Move to next task if there is one
      if (currentIndex < focusTaskOrder.length - 1) {
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else {
        // No more tasks, end focus mode
        toast({
          description: "Focus session complete! All tasks have been processed.",
        });
        onFocusEnd();
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
  }, [currentIndex, focusTaskOrder.length, completeTask, toast, isProcessing, inFocusMode, onFocusEnd]);
  
  // Handle task skip
  const handleSkip = useCallback(async () => {
    if (isProcessing || !inFocusMode || !currentTask) return;
    
    try {
      setIsProcessing(true);
      await incrementSkipCount(currentTask.id);
      
      // Move to next task if there is one
      if (currentIndex < focusTaskOrder.length - 1) {
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else {
        // No more tasks, end focus mode
        toast({
          description: "Focus session complete! All tasks have been processed.",
        });
        onFocusEnd();
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
  }, [currentTask, currentIndex, focusTaskOrder.length, incrementSkipCount, toast, isProcessing, inFocusMode, onFocusEnd]);
  
  // Handle return to top
  const handleReturnToTop = useCallback(() => {
    if (isProcessing) return;
    setCurrentIndex(0);
    toast({
      description: "Returned to top priority task",
    });
  }, [isProcessing, toast]);
  
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
