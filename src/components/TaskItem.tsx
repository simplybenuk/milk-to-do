
import { useState } from 'react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onComplete, onDelete }: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      onComplete(task.id);
    }, 500);
  };

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 rounded-lg border p-4 shadow-sm transition-all",
        "hover:shadow-md animate-fade-in",
        isCompleting && "animate-task-complete",
        task.completed && "opacity-50"
      )}
    >
      <button
        onClick={handleComplete}
        className={cn(
          "h-6 w-6 shrink-0 rounded-full border-2 transition-colors",
          "hover:bg-milk-100",
          task.completed && "bg-milk-300 border-milk-400"
        )}
      />
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-medium text-milk-900 truncate",
          task.completed && "line-through"
        )}>
          {task.title}
        </h3>
        <div className="flex items-center gap-4 mt-2 text-sm text-milk-500">
          <span className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
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
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:text-red-600"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
