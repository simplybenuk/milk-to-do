
import { AlertCircle } from 'lucide-react';

interface PriorityScoreBadgeProps {
  score: number;
}

export function PriorityScoreBadge({ score }: PriorityScoreBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
      <AlertCircle className="h-3 w-3" />
      <span>{Math.round(score)}</span>
    </div>
  );
}
