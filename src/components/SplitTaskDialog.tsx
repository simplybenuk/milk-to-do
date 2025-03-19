
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const { addTask, completeTask } = useTaskStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    // Set expiry date to 30 days from now (same as normal tasks)
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    try {
      // Add the child task linked to the parent
      await addTask(title.trim(), priority, expiryDate, parentTaskId);
      
      // Mark the parent task as closed
      await completeTask(parentTaskId, 'parent');
      
      // Show success message
      toast({
        title: "Task Split Successfully",
        description: "The original task has been split into smaller tasks."
      });
      
      // Reset form and close dialog
      setTitle("");
      setPriority("medium");
      onOpenChange(false);
      onSplitComplete();
    } catch (error) {
      console.error("Error splitting task:", error);
      toast({
        title: "Error",
        description: "Failed to split the task. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="animate-slide-up sm:max-w-[425px] pb-6">
        <DialogHeader>
          <DialogTitle>Split Task Into Smaller Steps</DialogTitle>
        </DialogHeader>
        
        <div className="my-4 text-sm text-muted-foreground">
          <p>Original task: <span className="font-medium text-foreground">{parentTaskTitle}</span></p>
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
          <Button type="submit" className="w-full">
            <Scissors className="mr-2 h-4 w-4" />
            Create Split Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
