
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskNavigationProps {
  currentIndex: number;
  totalTasks: number;
  showReturnButton: boolean;
  onReturnToTop: () => void;
  inFocusMode?: boolean;
}

export function TaskNavigation({ 
  currentIndex, 
  totalTasks, 
  showReturnButton, 
  onReturnToTop,
  inFocusMode
}: TaskNavigationProps) {
  // Use better contrast for the task counter when in focus mode
  const counterClasses = cn(
    "font-header text-sm",
    inFocusMode ? "text-white font-semibold bg-gray-800/50 px-3 py-1 rounded-full" : "text-muted-foreground"
  );

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <span className={counterClasses}>Task {currentIndex + 1} of {totalTasks}</span>
      {showReturnButton && (
        <Button
          onClick={onReturnToTop}
          variant="outline"
          size="sm"
          className={inFocusMode ? "bg-card hover:bg-card/90 text-foreground" : ""}
        >
          <ArrowUp className="mr-2 h-4 w-4" />
          Return to Top Priority
        </Button>
      )}
    </div>
  );
}
