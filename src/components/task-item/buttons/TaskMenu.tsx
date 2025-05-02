
import { MoreHorizontal, RefreshCw } from 'lucide-react';
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
  onRefresh?: (taskId: string) => void;
  showMenuButton?: boolean;
}

export function TaskMenu({ 
  task, 
  onEdit, 
  onDelete,
  onRefresh,
  showMenuButton = true
}: TaskMenuProps) {
  // If there are no actions available or menu button is hidden, don't render anything
  if ((!onEdit && !onDelete && !onRefresh) || !showMenuButton) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onRefresh && task.status === 'open' && (
          <DropdownMenuItem 
            onClick={() => onRefresh(task.id)}
            className="text-purple-500 hover:text-purple-700 flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh task
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
