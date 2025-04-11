
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TagBadgeProps {
  name: string;
  color?: string;
  onRemove?: () => void;
  onClick?: () => void;
  interactive?: boolean;
  selected?: boolean;
}

export function TagBadge({ 
  name, 
  color = 'default', 
  onRemove, 
  onClick,
  interactive = false,
  selected = false
}: TagBadgeProps) {
  return (
    <Badge 
      className={`
        cursor-${interactive || onClick ? 'pointer' : 'default'} 
        flex items-center gap-1 px-2 py-1 m-0.5
        ${selected ? 'bg-primary' : 'bg-secondary'}
        ${interactive ? 'hover:bg-primary/90' : ''}
      `}
      onClick={onClick}
    >
      <span className="truncate max-w-[100px]">{name}</span>
      {onRemove && (
        <X 
          className="h-3 w-3 cursor-pointer hover:text-destructive" 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </Badge>
  );
}
