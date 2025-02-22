
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Priority } from '@/types/task';
import { Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface AddTaskDialogProps {
  onAddTask: (title: string, priority: Priority, expiryDate: Date) => void;
}

export function AddTaskDialog({ onAddTask }: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAddTask(title.trim(), priority, expiryDate);
    setTitle("");
    setPriority("medium");
    setExpiryDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
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
      <DialogContent className="animate-slide-up sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
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
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-milk-500" />
            <input
              type="date"
              value={format(expiryDate, "yyyy-MM-dd")}
              onChange={(e) => setExpiryDate(new Date(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Button type="submit" className="w-full">
            Add Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
