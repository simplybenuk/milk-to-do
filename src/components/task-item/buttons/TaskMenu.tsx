
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
  onEdit?: (task: Task) => void;
  onDelete?: () => void;
  showMenuButton?: boolean;
}

export function TaskMenu({ 
  task, 
  onEdit, 
  onDelete,
  showMenuButton = true
}: TaskMenuProps) {
  // If there are no actions available or menu button is hidden, don't render anything
  if ((!onEdit && !onDelete) || !showMenuButton) {
    return null;
  }

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
