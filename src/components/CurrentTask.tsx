
import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import { Button } from '@/components/ui/button';
import { Check, SkipForward, ArrowUp } from 'lucide-react';

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

  return (
    <div className="w-full max-w-xl animate-fade-in">
      <div className="text-center mb-4 text-sm text-milk-600">
        Task {currentIndex + 1} of {totalTasks}
        {showReturnButton && (
          <Button
            onClick={onReturnToTop}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            <ArrowUp className="mr-2 h-4 w-4" />
            Return to Top Priority
          </Button>
        )}
      </div>
      <TaskItem
        key={task.id}
        task={task}
        onComplete={() => {}}
        onDelete={() => {}}
      />
      <div className="flex justify-center gap-4 mt-6">
        <Button
          onClick={() => onComplete(task.id)}
          className="w-32 bg-green-500 hover:bg-green-600"
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
    </div>
  );
}
