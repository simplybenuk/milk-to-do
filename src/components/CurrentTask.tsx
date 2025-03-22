
import { Task } from '@/types/task';
import { TaskItem } from './task-item';
import { Button } from '@/components/ui/button';
import { Check, SkipForward, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import useTaskStore from '@/stores/useTaskStore';

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
          <span>Task {currentIndex + 1} of {totalTasks}</span>
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
            className="w-32 bg-green-500 hover:bg-green-600"
            disabled={task.status === 'closed'}
          >
            <Check className="mr-2 h-4 w-4" />
            Complete
          </Button>
          <Button
            onClick={onSkip}
            variant="outline"
            className="w-32"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip
          </Button>
        </div>
      )}
    </div>
  );
}
