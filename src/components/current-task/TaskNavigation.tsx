
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

interface TaskNavigationProps {
  currentIndex: number;
  totalTasks: number;
  showReturnButton: boolean;
  onReturnToTop: () => void;
}

export function TaskNavigation({ 
  currentIndex, 
  totalTasks, 
  showReturnButton, 
  onReturnToTop 
}: TaskNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-4 text-sm text-milk-600">
      <span className="font-header">Task {currentIndex + 1} of {totalTasks}</span>
      {showReturnButton && (
        <Button
          onClick={onReturnToTop}
          variant="outline"
          size="sm"
        >
          <ArrowUp className="mr-2 h-4 w-4" />
          Return to Top Priority
        </Button>
      )}
    </div>
  );
}
