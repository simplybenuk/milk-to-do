import { Task } from '@/types/task';
import { TaskItem } from './task-item';
import { useState } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { 
  TaskNavigation, 
  ParentTaskView, 
  TaskActionButtons,
  getButtonStyles
} from './current-task';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

interface CurrentTaskProps {
  task: Task;
  onComplete: (id: string) => void;
  onSkip: () => void;
  onReturnToTop: () => void;
  currentIndex: number;
  totalTasks: number;
  inFocusMode?: boolean;
  onExitFocusMode?: () => void;
}

export function CurrentTask({ 
  task, 
  onComplete, 
  onSkip, 
  onReturnToTop,
  currentIndex, 
  totalTasks,
  inFocusMode,
  onExitFocusMode
}: CurrentTaskProps) {
  const showReturnButton = currentIndex > 0;
  const { tasks } = useTaskStore();
  const [viewingParent, setViewingParent] = useState<Task | null>(null);
  const { toast } = useToast();

  if (!task && !viewingParent) {
    return (
      <div className="text-center py-12 bg-card rounded-lg shadow-lg">
        <p className="text-milk-500">No task available. Try adding a new task!</p>
      </div>
    );
  }

  const handleViewParent = (parentId: string) => {
    const parentTask = tasks.find(t => t.id === parentId);
    if (parentTask) {
      setViewingParent(parentTask);
    }
  };

  const displayTask = viewingParent || task;
  
  const buttonStyles = getButtonStyles(task);

  if (viewingParent) {
    return (
      <ParentTaskView 
        parentTask={viewingParent}
        tasks={tasks}
        onReturn={() => setViewingParent(null)}
      />
    );
  }

  return (
    <div className="w-full max-w-xl animate-fade-in">
      <TaskNavigation
        currentIndex={currentIndex}
        totalTasks={totalTasks}
        showReturnButton={showReturnButton}
        onReturnToTop={onReturnToTop}
        inFocusMode={inFocusMode}
      />
      
      <div className={`bg-card rounded-lg shadow-xl ${inFocusMode ? 'ring-4 ring-primary/20' : ''}`}>
        <TaskItem
          key={displayTask.id}
          task={displayTask}
          onComplete={() => {}}
          onDelete={() => {}}
          allTasks={tasks}
          onViewParent={handleViewParent}
          showDeleteButton={false}
          inFocusMode={true}
        />
      </div>
      
      <TaskActionButtons
        task={task}
        onComplete={onComplete}
        onSkip={onSkip}
        buttonStyles={buttonStyles}
      />
        
      {inFocusMode && onExitFocusMode && (
        <div className="mt-4 flex justify-center">
          <Button 
            onClick={onExitFocusMode}
            variant="outline" 
            className="border-red-500 text-red-500 hover:bg-red-50 w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Exit Focus Mode
          </Button>
        </div>
      )}
    </div>
  );
}
