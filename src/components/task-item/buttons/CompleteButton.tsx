
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface CompleteButtonProps {
  onComplete: () => void;
}

export function CompleteButton({ onComplete }: CompleteButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="text-green-500 hover:text-green-700 hover:bg-green-50 shrink-0 w-10 h-10 rounded-full"
      onClick={onComplete}
      title="Complete task"
    >
      <CheckCircle className="h-5 w-5" />
    </Button>
  );
}
