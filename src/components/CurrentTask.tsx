
import { Task } from '@/types/task';
import { TaskItem } from './task-item';
import { Button } from '@/components/ui/button';
import { Check, SkipForward, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';

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
  const { tasks } = useTaskStore();
  const [viewingParent, setViewingParent] = useState<Task | null>(null);

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
        onDelete={() => {}}
        allTasks={tasks}
        onViewParent={handleViewParent}
      />
      
      {!viewingParent && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={() => onComplete(task.id)}
            className={cn("w-32", buttonStyles.complete)}
            disabled={task.status === 'closed'}
          >
            <Check className="mr-2 h-4 w-4" />
            Complete
          </Button>
          <Button
            onClick={onSkip}
            variant="outline"
            className={cn("w-32", buttonStyles.skip)}
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip
          </Button>
        </div>
      )}
    </div>
  );
}
