
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  onClick: () => void;
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 w-10 h-10 rounded-full"
      onClick={onClick}
      title="Delete task"
    >
      <Trash2 className="h-5 w-5" />
    </Button>
  );
}
