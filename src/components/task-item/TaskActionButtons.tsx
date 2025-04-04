
import { Task } from '@/types/task';
import { EditButton } from './buttons/EditButton';
import { CompleteButton } from './buttons/CompleteButton';
import { SplitButton } from './buttons/SplitButton';
import { DeleteButton } from './buttons/DeleteButton';

interface TaskActionButtonsProps {
  task: Task;
  showCompleteButton?: boolean;
  showDeleteButton?: boolean;
  onComplete: (id: string) => void;
  onDelete?: () => void;
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
            <EditButton task={task} onEdit={onEdit} />
          )}
          <CompleteButton onComplete={handleComplete} />
          <SplitButton onSplit={handleSplitTask} />
        </>
      )}
      {showDeleteButton && (
        <DeleteButton onClick={() => setShowDeleteDialog(true)} />
      )}
    </div>
  );
}
