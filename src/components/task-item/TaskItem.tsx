
import { useState } from 'react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextWithLinks } from './TextWithLinks';
import { PriorityBadge } from './PriorityBadge';
import { ChildTasksList } from './ChildTasksList';
import { DeleteTaskDialog } from './DeleteTaskDialog';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  showCompleteButton?: boolean;
  onCreateChildTask?: (parentId: string, parentTitle: string) => void;
  allTasks?: Task[]; // To find and display child tasks
}

export function TaskItem({ 
  task, 
  onComplete, 
  onDelete, 
  showCompleteButton = false,
  onCreateChildTask,
  allTasks = []
}: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Get child tasks if this is a parent task
  const childTasks = task.child_task_ids?.length > 0 && allTasks?.length > 0
    ? allTasks.filter(t => task.child_task_ids.includes(t.id))
    : [];

  const isParentTask = task.closed_status === 'parent' && childTasks.length > 0;

  const handleComplete = () => {
    setIsCompleting(true);
    // Add slight delay to allow animation to play
    setTimeout(() => {
      onComplete(task.id);
    }, 300);
  };

  return (
    <>
      <div
        className={cn(
          "relative flex items-start gap-4 rounded-lg border p-4 sm:p-6 shadow-lg transition-all bg-white w-full max-w-full",
          "hover:shadow-xl animate-fade-in",
          isCompleting && "animate-task-complete",
          task.status === 'closed' && "opacity-50"
        )}
      >
        <div className="flex-1 min-w-0 overflow-hidden break-words">
          <h3 className="text-lg sm:text-xl font-medium text-milk-900 mb-2 sm:mb-4 break-words overflow-hidden">
            <TextWithLinks text={task.title} />
          </h3>
          <div className="flex flex-col gap-2">
            <PriorityBadge priority={task.priority} />
            <span className="text-xs sm:text-sm text-milk-500">
              Expires: {format(task.expiry_date, "d MMM HH:mm")}
            </span>

            {/* Display child tasks section for parent tasks */}
            {isParentTask && (
              <ChildTasksList
                task={task}
                childTasks={childTasks}
                onCreateChildTask={onCreateChildTask}
              />
            )}
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 flex gap-2">
          {showCompleteButton && (
            <Button
              variant="ghost"
              size="icon"
              className="text-green-500 hover:text-green-700 hover:bg-green-50 shrink-0"
              onClick={handleComplete}
              title="Complete task"
            >
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
            onClick={() => setShowDeleteDialog(true)}
            title="Delete task"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      <DeleteTaskDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={() => onDelete(task.id)}
      />
    </>
  );
}
