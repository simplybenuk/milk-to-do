import { X, Tag as TagIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

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
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
        "bg-purple-100 text-purple-800 border border-purple-200",
        "transition-colors",
        selected && "bg-purple-200 border-purple-300",
        interactive && "cursor-pointer hover:bg-purple-200",
        !interactive && !onClick && "cursor-default"
      )}
      onClick={onClick}
    >
      <TagIcon className="h-3 w-3 text-purple-600" />
      <span className="truncate max-w-[100px]">{name}</span>
      {onRemove && (
        <X 
          className="h-3.5 w-3.5 text-purple-500 hover:text-purple-800 cursor-pointer ml-0.5" 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </div>
  );
}
