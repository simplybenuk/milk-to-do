
import { Badge } from '@/components/ui/badge';

interface PriorityScoreBadgeProps {
  score: number;
}

export function PriorityScoreBadge({ score }: PriorityScoreBadgeProps) {
  return (
    <Badge variant="secondary" className="text-xs">
      Score: {Math.round(score)}
    </Badge>
  );
}
