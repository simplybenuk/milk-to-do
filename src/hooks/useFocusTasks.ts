
import { useState, useEffect } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { Task } from '@/types/task';

export function useFocusTasks(inFocusMode: boolean) {
  const { getSortedTasksForFocusMode } = useTaskStore();
  const [focusTaskOrder, setFocusTaskOrder] = useState<Task[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTagIds, setSelectedTagIds] = useState<string[] | undefined>(undefined);
  const [noTasksAvailable, setNoTasksAvailable] = useState(false);
  
  // Get tasks and initialize focus mode session if needed
  useEffect(() => {
    // If we're in focus mode, initialize the task list
    if (inFocusMode) {
      const currentDate = new Date();
      
      // Get tasks sorted using our focus mode sorting algorithm
      const sortedTasks = getSortedTasksForFocusMode();
      
      // Filter out any expired tasks
      let validTasks = sortedTasks.filter(task => 
        new Date(task.expiry_date) >= currentDate
      );
      
      // Filter by selected tags if any are specified
      if (selectedTagIds && selectedTagIds.length > 0) {
        validTasks = validTasks.filter(task => {
          // If task has no tags but selectedTagIds exist, filter it out
          if (!task.tags || task.tags.length === 0) {
            return false;
          }
          
          // Check if any of the task's tags are in the selected tags
          return task.tags.some(tagId => selectedTagIds.includes(tagId));
        });
      }
      
      console.log('Initializing focus tasks with', validTasks.length, 'tasks', 
                  selectedTagIds ? `filtered by ${selectedTagIds.length} tags` : 'unfiltered');
      setFocusTaskOrder(validTasks);
      setCurrentIndex(0);
      setNoTasksAvailable(validTasks.length === 0);
    }
  }, [inFocusMode, getSortedTasksForFocusMode, selectedTagIds]);
  
  // Reset focus session when leaving focus mode
  useEffect(() => {
    if (!inFocusMode) {
      setFocusTaskOrder([]);
      setCurrentIndex(0);
      setSelectedTagIds(undefined);
      setNoTasksAvailable(false);
    }
  }, [inFocusMode]);
  
  // Get the current task based on the index
  const currentTask = focusTaskOrder.length > 0 && currentIndex < focusTaskOrder.length 
    ? focusTaskOrder[currentIndex] 
    : undefined;
  
  // Move to the next task
  const moveToNextTask = () => {
    if (currentIndex < focusTaskOrder.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      return true;
    }
    
    // If we're at the end of the tasks, set the flag that no more tasks are available
    setNoTasksAvailable(true);
    return false;
  };
  
  // Return to top task
  const returnToTop = () => {
    if (focusTaskOrder.length > 0) {
      setCurrentIndex(0);
      setNoTasksAvailable(false);
    }
  };
  
  return {
    focusTaskOrder,
    currentTask,
    currentIndex,
    moveToNextTask,
    returnToTop,
    setSelectedTagIds,
    noTasksAvailable
  };
}
