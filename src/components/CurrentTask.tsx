
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

  // Add a safety check for task existence
  if (!task && !viewingParent) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-lg">
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
      {inFocusMode && (
        <div className="mb-4 bg-white rounded-lg p-4 text-center shadow-md">
          <h2 className="text-3xl font-bold focus-mode-heading mb-1">Your Top Priority</h2>
          <p className="text-milk-600">Complete or skip tasks in your current focus session</p>
        </div>
      )}
      
      <TaskNavigation
        currentIndex={currentIndex}
        totalTasks={totalTasks}
        showReturnButton={showReturnButton}
        onReturnToTop={onReturnToTop}
      />
      
      <div className={`bg-white rounded-lg shadow-xl ${inFocusMode ? 'ring-4 ring-primary/20' : ''}`}>
        <TaskItem
          key={displayTask.id}
          task={displayTask}
          onComplete={() => {}}
          onDelete={() => {}}
          allTasks={tasks}
          onViewParent={handleViewParent}
          showDeleteButton={false} // Hide delete button in focus mode
        />
      </div>
      
      <TaskActionButtons
        task={task}
        onComplete={onComplete}
        onSkip={onSkip}
        buttonStyles={buttonStyles}
      />
        
      {/* Exit focus mode button below the action buttons */}
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
