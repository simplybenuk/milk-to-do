
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
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
        "transition-all duration-200",
        selected 
          ? "bg-purple-200 border-purple-300 text-purple-800" 
          : "bg-transparent border-purple-200 text-purple-500 opacity-70 hover:opacity-100",
        interactive && "cursor-pointer",
        !interactive && !onClick && "cursor-default"
      )}
      onClick={onClick}
    >
      <TagIcon className={cn(
        "h-3 w-3", 
        selected ? "text-purple-600" : "text-purple-400 opacity-70"
      )} />
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
