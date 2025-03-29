
import { Task } from '@/types/task';
import { TaskItem } from './task-item';
import { Button } from '@/components/ui/button';
import { Check, SkipForward, ArrowUp, Scissors } from 'lucide-react';
import { useState } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import { SplitTaskDialog } from './SplitTaskDialog';
import { useToast } from '@/hooks/use-toast';

interface CurrentTaskProps {
  task: Task;
  onComplete: (id: string) => void;
  onSkip: () => void;
  onReturnToTop: () => void;
  currentIndex: number;
  totalTasks: number;
}

export function CurrentTask({ 
  task, 
  onComplete, 
  onSkip, 
  onReturnToTop,
  currentIndex, 
  totalTasks 
}: CurrentTaskProps) {
  const showReturnButton = currentIndex > 0;
  const { tasks, deleteTask, addTask } = useTaskStore();
  const [viewingParent, setViewingParent] = useState<Task | null>(null);
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const { toast } = useToast();

  // Add a safety check for task existence
  if (!task && !viewingParent) {
    return (
      <div className="text-center py-12">
        <p className="text-milk-500">No task available. Try adding a new task!</p>
      </div>
    );
  }

  // Function to handle parent view
  const handleViewParent = (parentId: string) => {
    const parentTask = tasks.find(t => t.id === parentId);
    if (parentTask) {
      setViewingParent(parentTask);
    }
  };

  // Function to handle task deletion
  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
    toast({
      title: "Task deleted",
      description: "The task has been permanently removed.",
    });
    
    // Move to the next task in focus mode
    if (currentIndex < totalTasks - 1) {
      onReturnToTop();
    } else {
      // If we're at the last task, just reload
      window.location.reload();
    }
  };

  // Function to handle split task dialog
  const handleSplitTask = () => {
    setShowSplitDialog(true);
  };

  // Function to handle split task completion
  const handleSplitComplete = async (title: string, priority: any) => {
    if (!task) return;
    
    try {
      // Set expiry date to 30 days from now
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      // Add the child task linked to the parent (but don't mark parent as closed in focus mode)
      await addTask(title.trim(), priority, expiryDate, task.id);
      
      toast({
        title: "Task Split",
        description: "A new subtask has been created while keeping the original task.",
      });
      
      setShowSplitDialog(false);
    } catch (error) {
      console.error("Error splitting task:", error);
      toast({
        title: "Error",
        description: "Failed to split the task. Please try again.",
        variant: "destructive"
      });
    }
  };

  // If viewing a parent, show that instead of current task
  const displayTask = viewingParent || task;
  
  // Get button styling based on task age
  const getButtonStyles = () => {
    if (!task) return {};
    
    const ageInDays = differenceInDays(new Date(), new Date(task.created_at));
    const daysUntilExpiry = differenceInDays(new Date(task.expiry_date), new Date());
    
    if (daysUntilExpiry < 0) {
      return {
        complete: "bg-expired-accent hover:bg-expired-accent/90 text-white",
        skip: "border-expired-accent/50 text-expired-text hover:bg-expired-bg/50"
      };
    }
    
    if (ageInDays >= 21) {
      return {
        complete: "bg-sour-accent hover:bg-sour-accent/90 text-white",
        skip: "border-sour-accent/50 text-sour-text hover:bg-sour-bg/50"
      };
    }
    
    if (ageInDays >= 8) {
      return {
        complete: "bg-spoiling-accent hover:bg-spoiling-accent/90 text-spoiling-text",
        skip: "border-spoiling-accent/50 text-spoiling-text hover:bg-spoiling-bg/50"
      };
    }
    
    return {
      complete: "bg-green-500 hover:bg-green-600 text-white",
      skip: "border-fresh-accent/50 text-fresh-text hover:bg-fresh-bg/50"
    };
  };
  
  const buttonStyles = getButtonStyles();

  return (
    <div className="w-full max-w-xl animate-fade-in">
      {viewingParent && (
        <div className="mb-4 flex justify-between items-center">
          <span className="text-sm text-milk-600">Viewing parent task</span>
          <Button
            onClick={() => setViewingParent(null)}
            variant="outline"
            size="sm"
          >
            Return to current task
          </Button>
        </div>
      )}
      
      {!viewingParent && (
        <div className="flex items-center justify-center gap-2 mb-4 text-sm text-milk-600">
          <span className="font-header">Task {currentIndex + 1} of {totalTasks}</span>
          {showReturnButton && (
            <Button
              onClick={onReturnToTop}
              variant="outline"
              size="sm"
            >
              <ArrowUp className="mr-2 h-4 w-4" />
              Return to Top Priority
            </Button>
          )}
        </div>
      )}
      
      <TaskItem
        key={displayTask.id}
        task={displayTask}
        onComplete={() => {}}
        onDelete={() => handleDelete(displayTask.id)}
        allTasks={tasks}
        onViewParent={handleViewParent}
      />
      
      {!viewingParent && (
        <div className="flex justify-center gap-3 mt-6">
          <Button
            onClick={() => onComplete(task.id)}
            className={cn("flex-1 h-11", buttonStyles.complete)}
            disabled={task.status === 'closed'}
          >
            <Check className="mr-2 h-5 w-5" />
            Complete
          </Button>
          <Button
            onClick={handleSplitTask}
            variant="outline"
            className="h-11 px-4"
          >
            <Scissors className="mr-2 h-5 w-5" />
            Split
          </Button>
          <Button
            onClick={onSkip}
            variant="outline"
            className={cn("flex-1 h-11", buttonStyles.skip)}
          >
            <SkipForward className="mr-2 h-5 w-5" />
            Skip
          </Button>
        </div>
      )}
      
      <SplitTaskDialog
        open={showSplitDialog}
        onOpenChange={setShowSplitDialog}
        parentTaskId={task?.id || ''}
        parentTaskTitle={task?.title || ''}
        onSplitComplete={handleSplitComplete}
      />
    </div>
  );
}
