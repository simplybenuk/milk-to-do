
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, Scissors, Edit } from 'lucide-react';

interface TaskActionButtonsProps {
  task: Task;
  showCompleteButton?: boolean;
  showDeleteButton?: boolean;
  onComplete: (id: string) => void;
  onDelete: () => void;
  onCreateChildTask?: (parentId: string, parentTitle: string) => void;
  onEdit?: (task: Task) => void;
  isCompleting: boolean;
  setShowDeleteDialog: (show: boolean) => void;
}

export function TaskActionButtons({ 
  task, 
  showCompleteButton, 
  showDeleteButton,
  onComplete, 
  onCreateChildTask,
  onEdit,
  isCompleting,
  setShowDeleteDialog
}: TaskActionButtonsProps) {
  const handleComplete = () => {
    // Add slight delay to allow animation to play
    setTimeout(() => {
      onComplete(task.id);
    }, 300);
  };

  const handleSplitTask = () => {
    if (onCreateChildTask) {
      onCreateChildTask(task.id, task.title);
    }
  };

  return (
    <div className="absolute bottom-5 right-5 flex gap-3">
      {showCompleteButton && (
        <>
          {onEdit && task.status === 'open' && (
            <Button
              variant="outline"
              size="icon"
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 shrink-0 w-10 h-10 rounded-full"
              onClick={() => onEdit(task)}
              title="Edit task"
            >
              <Edit className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="text-green-500 hover:text-green-700 hover:bg-green-50 shrink-0 w-10 h-10 rounded-full"
            onClick={handleComplete}
            title="Complete task"
          >
            <CheckCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-teal-500 hover:text-teal-700 hover:bg-teal-50 shrink-0 w-10 h-10 rounded-full"
            onClick={handleSplitTask}
            title="Split into subtasks"
          >
            <Scissors className="h-5 w-5" />
          </Button>
        </>
      )}
      {showDeleteButton && (
        <Button
          variant="outline"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 w-10 h-10 rounded-full"
          onClick={() => setShowDeleteDialog(true)}
          title="Delete task"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
