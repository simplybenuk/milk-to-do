
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/types/task';

interface TaskMenuProps {
  task: Task;
  onComplete?: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: () => void;
  onSplit?: () => void;
  showCompleteOption?: boolean;
}

export function TaskMenu({ 
  task, 
  onComplete,
  onEdit, 
  onDelete,
  onSplit,
  showCompleteOption = true
}: TaskMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 absolute top-3 right-3"
        >
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {showCompleteOption && onComplete && (
          <DropdownMenuItem onClick={onComplete}>
            Mark as complete
          </DropdownMenuItem>
        )}
        {onSplit && (
          <DropdownMenuItem onClick={onSplit}>
            Split into smaller tasks
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(task)}>
            Edit task
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} className="text-red-500 hover:text-red-700">
            Delete task
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
