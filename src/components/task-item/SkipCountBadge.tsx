
import { SkipForward } from 'lucide-react';

interface SkipCountBadgeProps {
  skipCount: number;
}

export function SkipCountBadge({ skipCount }: SkipCountBadgeProps) {
  if (skipCount === 0) return null;
  
  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
      <SkipForward className="h-3 w-3" />
      <span>{skipCount}</span>
    </div>
  );
}
