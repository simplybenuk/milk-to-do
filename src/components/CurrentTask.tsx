
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

interface CurrentTaskProps {
  task: Task;
  onComplete: (id: string) => void;
  onSkip: () => void;
  onReturnToTop: () => void;
  currentIndex: number;
  totalTasks: number;
}

export function CurrentTask({ 
  task, 
  onComplete, 
  onSkip, 
  onReturnToTop,
  currentIndex, 
  totalTasks 
}: CurrentTaskProps) {
  const showReturnButton = currentIndex > 0;
  const { tasks } = useTaskStore();
  const [viewingParent, setViewingParent] = useState<Task | null>(null);
  const { toast } = useToast();

  // Add a safety check for task existence
  if (!task && !viewingParent) {
    return (
      <div className="text-center py-12">
        <p className="text-milk-500">No task available. Try adding a new task!</p>
      </div>
    );
  }

  // Function to handle parent view
  const handleViewParent = (parentId: string) => {
    const parentTask = tasks.find(t => t.id === parentId);
    if (parentTask) {
      setViewingParent(parentTask);
    }
  };

  // If viewing a parent, show that instead of current task
  const displayTask = viewingParent || task;
  
  // Get button styling based on task age
  const buttonStyles = getButtonStyles(task);

  // If viewing parent task, show the parent view component
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
      />
      
      <TaskItem
        key={displayTask.id}
        task={displayTask}
        onComplete={() => {}}
        onDelete={() => {}}
        allTasks={tasks}
        onViewParent={handleViewParent}
        showDeleteButton={false} // Hide delete button in focus mode
      />
      
      <TaskActionButtons
        task={task}
        onComplete={onComplete}
        onSkip={onSkip}
        buttonStyles={buttonStyles}
      />
    </div>
  );
}
