
import { Task } from '@/types/task';
import { TaskMenu } from './buttons/TaskMenu';

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
    <TaskMenu 
      task={task}
      onComplete={showCompleteButton ? handleComplete : undefined}
      onEdit={onEdit}
      onDelete={() => setShowDeleteDialog(true)}
      onSplit={onCreateChildTask ? handleSplitTask : undefined}
      showCompleteOption={showCompleteButton && task.status === 'open'}
    />
  );
}
