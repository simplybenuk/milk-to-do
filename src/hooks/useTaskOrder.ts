
import { useRef, useCallback, useEffect } from 'react';
import { Task } from '@/types/task';

export function useTaskOrder(sortedOpenTasks: Task[]) {
  // Store the locked order of tasks for the focus session
  const lockedTaskOrderRef = useRef<string[]>([]);
  const isOrderLockedRef = useRef<boolean>(false);

  // Lock the task order when focus mode is activated
  const lockTaskOrder = useCallback(() => {
    console.log("Locking task order for focus session");
    lockedTaskOrderRef.current = sortedOpenTasks.map(task => task.id);
    isOrderLockedRef.current = true;
  }, [sortedOpenTasks]);

  // Reset the locked order
  const resetLockedOrder = useCallback(() => {
    console.log("Resetting locked task order");
    lockedTaskOrderRef.current = [];
    isOrderLockedRef.current = false;
  }, []);

  // Find the next task in the locked order
  const findNextTaskIndex = useCallback((currentTaskId: string, currentIndex: number): number => {
    // If we haven't locked the order or there are no tasks, just return the next index
    if (!isOrderLockedRef.current || lockedTaskOrderRef.current.length === 0) {
      return (currentIndex + 1) % Math.max(sortedOpenTasks.length, 1);
    }
    
    // Find the current task's position in the locked order
    const currentOrderIndex = lockedTaskOrderRef.current.indexOf(currentTaskId);
    
    // If not found or at the end, go back to the first task
    if (currentOrderIndex === -1 || currentOrderIndex >= lockedTaskOrderRef.current.length - 1) {
      return 0;
    }
    
    // Get the ID of the next task in the locked order
    const nextTaskId = lockedTaskOrderRef.current[currentOrderIndex + 1];
    
    // Find this task in the current sorted tasks
    const nextTaskIndex = sortedOpenTasks.findIndex(task => task.id === nextTaskId);
    
    // If the task is no longer in the list (e.g., completed or deleted), move to the next available
    if (nextTaskIndex === -1) {
      // Find the next available task in the locked order
      for (let i = currentOrderIndex + 1; i < lockedTaskOrderRef.current.length; i++) {
        const candidateId = lockedTaskOrderRef.current[i];
        const candidateIndex = sortedOpenTasks.findIndex(task => task.id === candidateId);
        if (candidateIndex !== -1) {
          return candidateIndex;
        }
      }
      // If no next task is found, return to first task
      return 0;
    }
    
    return nextTaskIndex;
  }, [sortedOpenTasks]);

  // Check if we're currently in focus mode with locked order
  const isOrderLocked = useCallback(() => {
    return isOrderLockedRef.current;
  }, []);

  return {
    lockTaskOrder,
    resetLockedOrder,
    findNextTaskIndex,
    isOrderLocked
  };
}
