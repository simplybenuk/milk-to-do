
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowDown, Scissors, Lock } from 'lucide-react';

interface PriorityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDowngradePriority: () => void;
  onSplitTask: () => void;
  onSkipAnyway: () => void;
  onBlocked?: () => void;
}

export function PriorityDialog({
  open,
  onOpenChange,
  onDowngradePriority,
  onSplitTask,
  onSkipAnyway,
  onBlocked = () => onOpenChange(false),
}: PriorityDialogProps) {
  // Ensure actions properly close the dialog when needed
  const handleDowngrade = () => {
    onDowngradePriority();
  };
  
  const handleSplit = () => {
    onSplitTask();
  };
  
  const handleBlocked = () => {
    onBlocked();
  };
  
  const handleSkipAnyway = () => {
    onSkipAnyway();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>This task seems important</DialogTitle>
          <DialogDescription>
            Would you like to break it down into smaller tasks, lower its priority, or mark it as blocked?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleDowngrade}
            variant="outline"
            className="w-full"
          >
            <ArrowDown className="mr-2 h-4 w-4" />
            Lower Priority
          </Button>
          <Button
            onClick={handleSplit}
            variant="outline"
            className="w-full"
          >
            <Scissors className="mr-2 h-4 w-4" />
            Split into Smaller Tasks
          </Button>
          <Button
            onClick={handleBlocked}
            variant="outline"
            className="w-full"
          >
            <Lock className="mr-2 h-4 w-4" />
            Blocked by Others
          </Button>
          <Button
            onClick={handleSkipAnyway}
            variant="ghost"
            className="w-full"
          >
            Skip Anyway
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
