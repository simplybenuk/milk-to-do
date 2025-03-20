
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowDown, Scissors, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  
  // Reset action state when dialog opens or closes
  useEffect(() => {
    setIsActionInProgress(false);
  }, [open]);
  
  // Handle actions with debounce to prevent double-clicks
  const handleAction = (actionFn: () => void) => {
    if (isActionInProgress) return;
    
    setIsActionInProgress(true);
    actionFn();
  };
  
  const handleDowngrade = () => {
    console.log("PriorityDialog: Downgrade button clicked");
    handleAction(onDowngradePriority);
  };
  
  const handleSplit = () => {
    console.log("PriorityDialog: Split button clicked");
    handleAction(onSplitTask);
  };
  
  const handleBlocked = () => {
    console.log("PriorityDialog: Blocked button clicked");
    handleAction(onBlocked);
  };
  
  const handleSkipAnyway = () => {
    console.log("PriorityDialog: Skip Anyway button clicked");
    handleAction(onSkipAnyway);
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
            disabled={isActionInProgress}
          >
            <ArrowDown className="mr-2 h-4 w-4" />
            Lower Priority
          </Button>
          <Button
            onClick={handleSplit}
            variant="outline"
            className="w-full"
            disabled={isActionInProgress}
          >
            <Scissors className="mr-2 h-4 w-4" />
            Split into Smaller Tasks
          </Button>
          <Button
            onClick={handleBlocked}
            variant="outline"
            className="w-full"
            disabled={isActionInProgress}
          >
            <Lock className="mr-2 h-4 w-4" />
            Blocked by Others
          </Button>
          <Button
            onClick={handleSkipAnyway}
            variant="ghost"
            className="w-full"
            disabled={isActionInProgress}
          >
            Skip Anyway
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
