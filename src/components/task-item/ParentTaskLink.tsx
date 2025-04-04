
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

interface ParentTaskLinkProps {
  parentId: string | undefined;
  onViewParent?: (parentId: string) => void;
}

export function ParentTaskLink({ parentId, onViewParent }: ParentTaskLinkProps) {
  if (!parentId) {
    return null;
  }
  
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
