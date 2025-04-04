
import { Badge } from '@/components/ui/badge';

interface SkipCountBadgeProps {
  skipCount: number;
}

export function SkipCountBadge({ skipCount }: SkipCountBadgeProps) {
  if (skipCount === 0) return null;
  
  return (
    <Badge variant="outline" className="text-xs">
      Skipped: {skipCount}
    </Badge>
  );
}
