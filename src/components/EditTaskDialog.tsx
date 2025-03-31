
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Task, Priority } from '@/types/task';
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  priority: z.enum(['high', 'medium', 'low']),
});

type FormValues = z.infer<typeof formSchema>;

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (id: string, title: string, priority: Priority) => Promise<void>;
}

export function EditTaskDialog({ task, open, onOpenChange, onEdit }: EditTaskDialogProps) {
  const { toast } = useToast();
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      priority: 'medium' as Priority,
    },
  });

  // Reset form and selected priority when task changes
  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        priority: task.priority,
      });
      setSelectedPriority(task.priority);
    }
  }, [task, form]);

  const onSubmit = async (values: FormValues) => {
    if (!task) return;
    
    try {
      await onEdit(task.id, values.title, selectedPriority);
      onOpenChange(false);
      toast({
        title: 'Task updated',
        description: 'Your task has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Failed to update task',
        description: 'There was an error updating your task.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="animate-slide-up sm:max-w-[425px] pb-6">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Textarea
            placeholder="What needs to be done?"
            value={form.watch('title')}
            onChange={(e) => form.setValue('title', e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex gap-2">
            {(["low", "medium", "high"] as Priority[]).map((p) => (
              <Button
                key={p}
                type="button"
                variant={selectedPriority === p ? "default" : "outline"}
                onClick={() => {
                  setSelectedPriority(p);
                  form.setValue('priority', p);
                }}
                className="flex-1 capitalize"
              >
                {p}
              </Button>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
