
import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import { Button } from '@/components/ui/button';
import { Check, SkipForward } from 'lucide-react';

interface CurrentTaskProps {
  task: Task;
  onComplete: (id: string) => void;
  onSkip: () => void;
}

export function CurrentTask({ task, onComplete, onSkip }: CurrentTaskProps) {
  return (
    <div className="w-full max-w-xl animate-fade-in">
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
