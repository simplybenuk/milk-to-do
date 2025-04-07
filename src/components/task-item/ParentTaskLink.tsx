
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ParentTaskLinkProps {
  parentId: string | undefined;
  onViewParent?: (parentId: string) => void;
  inFocusMode?: boolean;
  parentTitle?: string;
}

export function ParentTaskLink({ 
  parentId, 
  onViewParent, 
  inFocusMode = false,
  parentTitle
}: ParentTaskLinkProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  if (!parentId) {
    return null;
  }
  
  // In focus mode, show a non-clickable truncated parent reference
  if (inFocusMode && parentTitle) {
    const truncatedTitle = parentTitle.length > 35 
      ? `${parentTitle.substring(0, 35)}...` 
      : parentTitle;
    
    return (
      <div className="mb-2 text-xs flex items-center text-milk-600">
        <TooltipProvider>
          <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
            <TooltipTrigger asChild>
              <div 
                className="flex items-center gap-1 cursor-help"
                onClick={() => setIsTooltipOpen(!isTooltipOpen)}
              >
                <ArrowUp className="h-3 w-3" />
                <span className="font-medium">Parent: {truncatedTitle}</span>
              </div>
            </TooltipTrigger>
            {parentTitle.length > 35 && (
              <TooltipContent className="max-w-[300px] text-wrap break-words">
                <p>{parentTitle}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
  
  // Original clickable button for non-focus mode
  return (
    <div className="mb-2 text-xs flex items-center">
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-0 h-6 flex items-center gap-1 hover:text-milk-900"
        onClick={() => onViewParent && onViewParent(parentId)}
      >
        <ArrowUp className="h-3 w-3" />
        <span>View Parent Task</span>
      </Button>
    </div>
  );
}
