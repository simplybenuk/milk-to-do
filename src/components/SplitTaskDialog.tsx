
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Priority } from '@/types/task';
import { Scissors } from 'lucide-react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';

interface SplitTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentTaskId: string;
  parentTaskTitle: string;
  onSplitComplete: () => void;
}

export function SplitTaskDialog({
  open,
  onOpenChange,
  parentTaskId,
  parentTaskTitle,
  onSplitComplete
}: SplitTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [localParentId, setLocalParentId] = useState(parentTaskId);
  const [localParentTitle, setLocalParentTitle] = useState(parentTaskTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addTask, markTaskAsParent } = useTaskStore();
  const { toast } = useToast();

  // Update local state when props change to ensure we have the latest values
  useEffect(() => {
    if (open) {
      setLocalParentId(parentTaskId);
      setLocalParentTitle(parentTaskTitle);
      console.log("SplitTaskDialog opened with parent:", parentTaskId, parentTaskTitle);
    }
  }, [open, parentTaskId, parentTaskTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Calculate expiry date (30 days from now by default)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      console.log("Creating split task:", {
        title: title.trim(),
        priority,
        parentId: localParentId,
        expiryDate
      });
      
      // First ensure the parent task is marked as a parent
      await markTaskAsParent(localParentId);
      
      // Then create the new split task as a child of the parent
      await addTask(title.trim(), priority, expiryDate, localParentId);
      
      toast({
        title: "Task split successfully",
        description: "The new subtask has been created.",
      });
      
      // Reset form and close dialog
      setTitle("");
      setPriority("medium");
      onOpenChange(false);
      
      // Notify parent component that split is complete
      onSplitComplete();
    } catch (error) {
      console.error("Error splitting task:", error);
      toast({
        title: "Error",
        description: "Failed to split the task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="animate-slide-up sm:max-w-[425px] pb-6">
        <DialogHeader>
          <DialogTitle>Split Task Into Smaller Steps</DialogTitle>
          <DialogDescription>
            Breaking down large tasks helps you make progress more effectively.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 text-sm text-muted-foreground">
          <p>Original task: <span className="font-medium text-foreground">{localParentTitle}</span></p>
          <p className="mt-2">Create a smaller, more manageable task to work on first:</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <textarea
            placeholder="What's the first smaller step?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-none"
          />
          <div className="flex gap-2">
            {(["low", "medium", "high"] as Priority[]).map((p) => (
              <Button
                key={p}
                type="button"
                variant={priority === p ? "default" : "outline"}
                onClick={() => setPriority(p)}
                className="flex-1 capitalize"
              >
                {p}
              </Button>
            ))}
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={!title.trim() || isSubmitting}
          >
            <Scissors className="mr-2 h-4 w-4" />
            Create Split Task
            {isSubmitting && "..."}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
