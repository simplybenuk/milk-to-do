
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Priority } from '@/types/task';
import { Plus } from 'lucide-react';

interface AddTaskDialogProps {
  onAddTask: (title: string, priority: Priority, expiryDate: Date) => void;
}

export function AddTaskDialog({ onAddTask }: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    // Set expiry date to 30 days from now
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    onAddTask(title.trim(), priority, expiryDate);
    setTitle("");
    setPriority("medium");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom fixed bottom-0 left-0 right-0 top-[unset] !mt-0 !rounded-b-none border-0 max-h-[85vh] p-0 md:p-6 md:static md:!rounded-lg md:max-w-lg md:translate-x-[-50%] md:translate-y-[-50%]"
      >
        <div className="w-full max-w-full p-6 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4 mb-6">
            <textarea
              placeholder="What needs to be done?"
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
              Add Task
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
