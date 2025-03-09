
import { useState } from 'react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onDelete }: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <>
      <div
        className={cn(
          "relative flex items-start gap-4 rounded-lg border p-6 shadow-lg transition-all bg-white max-w-full",
          "hover:shadow-xl animate-fade-in",
          isCompleting && "animate-task-complete",
          task.status === 'closed' && "opacity-50"
        )}
      >
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="text-xl font-medium text-milk-900 mb-4 break-words">
            {task.title}
          </h3>
          <div className="flex flex-col gap-2">
            <span className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium w-fit",
              priorityColors[task.priority]
            )}>
              {task.priority}
            </span>
            <span className="text-sm text-milk-500">
              Expires: {format(task.expiry_date, "d MMM HH:mm")}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                onDelete(task.id);
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
