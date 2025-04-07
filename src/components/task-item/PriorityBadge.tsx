
import { cn } from '@/lib/utils';
import { Priority } from '@/types/task';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md' | 'lg';
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs sm:text-sm",
    lg: "px-3 py-1.5 text-sm"
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium w-fit border",
      priorityColors[priority],
      sizeClasses[size]
    )}>
      {priority}
    </span>
  );
}
