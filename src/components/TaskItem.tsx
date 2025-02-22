
import { useState } from 'react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <div
      className={cn(
        "relative flex items-start gap-4 rounded-lg border p-6 shadow-lg transition-all bg-white",
        "hover:shadow-xl animate-fade-in",
        isCompleting && "animate-task-complete",
        task.completed && "opacity-50"
      )}
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-medium text-milk-900 mb-4">
          {task.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-milk-500">
          <span className={cn(
            "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium",
            priorityColors[task.priority]
          )}>
            {task.priority}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatDistanceToNow(task.expiryDate, { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}
