
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Task } from '@/types/task';

interface EditButtonProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function EditButton({ task, onEdit }: EditButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 shrink-0 w-10 h-10 rounded-full"
      onClick={() => onEdit(task)}
      title="Edit task"
    >
      <Edit className="h-5 w-5" />
    </Button>
  );
}
