
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { Check, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskActionButtonsProps {
  task: Task;
  onComplete: (id: string) => void;
  onSkip: () => void;
  buttonStyles: {
    complete: string;
    skip: string;
  };
}

export function TaskActionButtons({ 
  task, 
  onComplete, 
  onSkip, 
  buttonStyles 
}: TaskActionButtonsProps) {
  return (
    <div className="flex justify-center gap-3 mt-6">
      <Button
        onClick={() => onComplete(task.id)}
        className={cn("flex-1 h-11 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all", buttonStyles.complete)}
        disabled={task.status === 'closed'}
      >
        <Check className="mr-2 h-5 w-5" />
        Complete
      </Button>
      <Button
        onClick={onSkip}
        variant="outline"
        className={cn("flex-1 h-11 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all", buttonStyles.skip)}
      >
        <SkipForward className="mr-2 h-5 w-5" />
        Skip
      </Button>
    </div>
  );
}
