
import { useCallback } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';

export function useTaskSkipActions(
  currentTask: Task | undefined,
  moveToNextTask: () => void,
  openPriorityDialog: (task: Task) => void,
  resetDialogState: () => void,
  setShowPriorityDialog: (show: boolean) => void,
  skipInProgress: boolean,
  setSkipInProgress: (inProgress: boolean) => void,
  handleLowPrioritySkip: () => Promise<void>
) {
  const { incrementSkipCount, fetchTasks } = useTaskStore();
  const { toast } = useToast();

  // "Skip Anyway" action for high/medium priority tasks
  const handleSkipAnyway = async () => {
    if (!currentTask || skipInProgress) return;
    
    try {
      setSkipInProgress(true);
      console.log("Skipping anyway task:", currentTask.title);
      
      // Store the current task ID before skipping
      const currentTaskId = currentTask.id;
      
      // First close dialog
      setShowPriorityDialog(false);
      
      // Then perform skip actions
      await incrementSkipCount(currentTaskId);
      await fetchTasks();
      
      toast({
        description: "Task skipped and skip count increased",
      });
      
      // Move to next task after a short delay to ensure the dialog is fully closed
      setTimeout(() => {
        moveToNextTask();
        setSkipInProgress(false);
      }, 200);
    } catch (error) {
      console.error("Error in handleSkipAnyway:", error);
      setShowPriorityDialog(false);
      setSkipInProgress(false);
      
      toast({
        title: "Error",
        description: "Failed to skip task. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Initial skip handler - shows dialog for high/medium priority
  const handleSkip = useCallback(() => {
    if (!currentTask || skipInProgress) return;
    
    console.log(`Handling skip for task: ${currentTask.title} with priority: ${currentTask.priority}`);
    
    // Reset dialog state to ensure clean state
    resetDialogState();
    
    if (currentTask.priority === 'high' || currentTask.priority === 'medium') {
      // For high or medium priority tasks, show the dialog
      openPriorityDialog(currentTask);
    } else {
      // For low priority tasks, directly increment skip count
      handleLowPrioritySkip();
    }
  }, [currentTask, openPriorityDialog, resetDialogState, skipInProgress, handleLowPrioritySkip]);

  return {
    handleSkip,
    handleSkipAnyway
  };
}
