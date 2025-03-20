
import { useRef, useEffect, useCallback } from 'react';
import { Task } from '@/types/task';

export function useTaskOrder(sortedOpenTasks: Task[], skipInProgress: boolean) {
  // Store the original task order
  const originalTaskOrderRef = useRef<string[]>([]);
  
  // Update the original task order reference when not in a skip operation
  useEffect(() => {
    if (!skipInProgress && sortedOpenTasks.length > 0) {
      originalTaskOrderRef.current = sortedOpenTasks.map(task => task.id);
    }
  }, [sortedOpenTasks, skipInProgress]);
  
  // Find the next task index based on original order
  const findNextTaskIndex = useCallback((currentTaskId: string, currentIndex: number): number => {
    // If we don't have an original order yet, just increment the index
    if (originalTaskOrderRef.current.length === 0) {
      return (currentIndex + 1) % sortedOpenTasks.length;
    }
    
    // Find the current task's position in the original order
    const currentOrderIndex = originalTaskOrderRef.current.indexOf(currentTaskId);
    if (currentOrderIndex === -1 || currentOrderIndex >= originalTaskOrderRef.current.length - 1) {
      return 0; // If not found or at the end, go back to the first task
    }
    
    // Get the ID of the next task in the original order
    const nextTaskId = originalTaskOrderRef.current[currentOrderIndex + 1];
    
    // Find this task in the current sorted tasks
    const nextTaskIndex = sortedOpenTasks.findIndex(task => task.id === nextTaskId);
    return nextTaskIndex !== -1 ? nextTaskIndex : 0;
  }, [sortedOpenTasks]);

  // Reset the original order
  const resetOriginalOrder = useCallback(() => {
    originalTaskOrderRef.current = sortedOpenTasks.map(task => task.id);
  }, [sortedOpenTasks]);

  return {
    findNextTaskIndex,
    resetOriginalOrder
  };
}
