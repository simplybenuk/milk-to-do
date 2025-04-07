
import { Task } from '@/types/task';
import { TaskMenu } from './buttons/TaskMenu';
import { CompleteButton } from './buttons/CompleteButton';
import { SplitButton } from './buttons/SplitButton';

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
  inFocusMode?: boolean;
}

export function TaskActionButtons({ 
  task, 
  showCompleteButton, 
  onComplete, 
  onCreateChildTask,
  onEdit,
  setShowDeleteDialog,
  inFocusMode = false
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
    <div className="absolute top-3 right-3 flex items-center gap-2">
      {/* Only show complete button if requested and task is open */}
      {showCompleteButton && task.status === 'open' && (
        <CompleteButton onComplete={handleComplete} />
      )}
      
      {/* Show split button if onCreateChildTask is provided */}
      {onCreateChildTask && (
        <SplitButton onSplit={handleSplitTask} />
      )}
      
      {/* Menu for Edit and Delete actions - hide in focus mode */}
      <TaskMenu 
        task={task}
        onEdit={onEdit}
        onDelete={() => setShowDeleteDialog(true)}
        showMenuButton={!inFocusMode}
      />
    </div>
  );
}
