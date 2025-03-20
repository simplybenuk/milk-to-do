
import { cn } from '@/lib/utils';
import { Priority } from '@/types/task';

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs sm:text-sm font-medium w-fit border",
      priorityColors[priority]
    )}>
      {priority}
    </span>
  );
}
