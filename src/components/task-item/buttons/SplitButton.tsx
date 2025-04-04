
import { Button } from '@/components/ui/button';
import { Scissors } from 'lucide-react';

interface SplitButtonProps {
  onSplit: () => void;
}

export function SplitButton({ onSplit }: SplitButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="text-teal-500 hover:text-teal-700 hover:bg-teal-50 shrink-0 w-10 h-10 rounded-full"
      onClick={onSplit}
      title="Split into subtasks"
    >
      <Scissors className="h-5 w-5" />
    </Button>
  );
}
