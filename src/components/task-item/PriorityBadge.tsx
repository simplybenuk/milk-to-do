
import { cn } from '@/lib/utils';
import { Priority } from '@/types/task';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md' | 'lg';
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  // Improved styles with icons for better visual distinction
  const priorityConfig = {
    low: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
      icon: ArrowDown
    },
    medium: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200",
      icon: ArrowRight
    },
    high: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
      icon: ArrowUp
    },
  };

  const config = priorityConfig[priority];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs sm:text-sm",
    lg: "px-3 py-1.5 text-sm"
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-medium border",
      config.bg,
      config.text,
      config.border,
      sizeClasses[size]
    )}>
      <Icon className="h-3 w-3" />
      <span>{priority}</span>
    </span>
  );
}
