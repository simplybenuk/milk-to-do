import { useState, useEffect, useRef } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';

export function useTaskNavigation() {
  const { getTasksByPriority, incrementSkipCount, updateTaskPriority, fetchTasks } = useTaskStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const { toast } = useToast();
  
  const sortedOpenTasks = getTasksByPriority().filter(task => task.status === 'open');
  const currentTask = sortedOpenTasks[currentIndex];
  
  const taskToSplitRef = useRef<Task | null>(null);

  useEffect(() => {
    if (currentIndex >= sortedOpenTasks.length && sortedOpenTasks.length > 0) {
      setCurrentIndex(0);
    }
  }, [sortedOpenTasks.length, currentIndex]);

  const handleSkip = async () => {
    if (!currentTask) return;
    
    await incrementSkipCount(currentTask.id);
    
    if (currentTask.priority === 'high' || currentTask.priority === 'medium') {
      taskToSplitRef.current = currentTask;
      setShowPriorityDialog(true);
    } else {
      moveToNextTask();
    }
  };

  const moveToNextTask = () => {
    if (currentIndex >= sortedOpenTasks.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleReturnToTop = () => {
    setCurrentIndex(0);
    toast({
      description: "Returned to top priority task",
    });
  };

  const handleDowngradePriority = async () => {
    if (!currentTask) return;
    
    const newPriority = currentTask.priority === 'high' ? 'medium' : 'low';
    const currentTaskId = currentTask.id;
    
    await updateTaskPriority(currentTaskId, newPriority);
    
    toast({
      title: "Priority Updated",
      description: `Task priority changed to ${newPriority}`,
    });
    
    setShowPriorityDialog(false);
    
    const updatedTasks = getTasksByPriority().filter(task => task.status === 'open');
    
    if (currentIndex >= updatedTasks.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex);
    }
  };

  const handleBlocked = () => {
    toast({
      description: "Moving to next task without updating priority",
    });
    setShowPriorityDialog(false);
    moveToNextTask();
  };

  const handleSplitComplete = () => {
    fetchTasks();
    setCurrentIndex(0);
    taskToSplitRef.current = null;
  };

  const handleSplitTask = () => {
    setShowPriorityDialog(false);
    setShowSplitDialog(true);
  };

  return {
    currentTask,
    currentIndex,
    sortedOpenTasks,
    showPriorityDialog,
    setShowPriorityDialog,
    showSplitDialog,
    setShowSplitDialog,
    handleSkip,
    handleReturnToTop,
    handleDowngradePriority,
    handleBlocked,
    moveToNextTask,
    handleSplitComplete,
    handleSplitTask,
    taskToSplit: taskToSplitRef.current
  };
}
