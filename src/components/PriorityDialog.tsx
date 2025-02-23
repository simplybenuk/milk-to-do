
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowDown, Scissors } from 'lucide-react';

interface PriorityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDowngradePriority: () => void;
  onSplitTask: () => void;
  onSkipAnyway: () => void;
}

export function PriorityDialog({
  open,
  onOpenChange,
  onDowngradePriority,
  onSplitTask,
  onSkipAnyway,
}: PriorityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>This task seems important</DialogTitle>
          <DialogDescription>
            Would you like to break it down into smaller tasks or lower its priority?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={onDowngradePriority}
            variant="outline"
            className="w-full"
          >
            <ArrowDown className="mr-2 h-4 w-4" />
            Lower Priority
          </Button>
          <Button
            onClick={onSplitTask}
            variant="outline"
            className="w-full"
          >
            <Scissors className="mr-2 h-4 w-4" />
            Split into Smaller Tasks
          </Button>
          <Button
            onClick={onSkipAnyway}
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
