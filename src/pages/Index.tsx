
import { useState } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { useToast } from '@/hooks/use-toast';
import { AllTasksList } from '@/components/AllTasksList';
import { CompletedTasksList } from '@/components/CompletedTasksList';
import { ExpiredTasksList } from '@/components/ExpiredTasksList';
import { PriorityDialog } from '@/components/PriorityDialog';
import { TaskHeader } from '@/components/TaskHeader';
import { CurrentTask } from '@/components/CurrentTask';

const Index = () => {
  const { tasks, completeTask, getTasksByPriority, updateTaskPriority } = useTaskStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'all' | 'completed' | 'expired'>('main');
  const sortedTasks = getTasksByPriority();
  const currentTask = sortedTasks[currentIndex];
  const { toast } = useToast();

  const handleComplete = (taskId: string) => {
    completeTask(taskId);
    const remainingTasks = sortedTasks.filter(task => task.status === 'open');
    if (remainingTasks.length > 0) {
      if (currentIndex >= remainingTasks.length - 1) {
        setCurrentIndex(0); // Reset to start if we're at the end
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      setCurrentIndex(0); // Reset to start if all tasks are completed
    }
  };

  const handleSkip = () => {
    if (currentTask && (currentTask.priority === 'high' || currentTask.priority === 'medium')) {
      setShowPriorityDialog(true);
    } else {
      moveToNextTask();
    }
  };

  const moveToNextTask = () => {
    const remainingTasks = sortedTasks.filter(task => task.status === 'open');
    if (currentIndex >= remainingTasks.length - 1) {
      setCurrentIndex(0); // Reset to start if we're at the end
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDowngradePriority = () => {
    if (!currentTask) return;
    
    const newPriority = currentTask.priority === 'high' ? 'medium' : 'low';
    updateTaskPriority(currentTask.id, newPriority);
    
    toast({
      title: "Priority Updated",
      description: `Task priority changed to ${newPriority}`,
    });
    
    setShowPriorityDialog(false);
    moveToNextTask();
  };

  const handleSplitTask = () => {
    toast({
      title: "Coming Soon",
      description: "Task splitting feature will be available soon!",
    });
    setShowPriorityDialog(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'all':
        return (
          <>
            <h2 className="text-2xl font-bold text-milk-900 mb-6">All Tasks</h2>
            <AllTasksList />
          </>
        );
      case 'completed':
        return (
          <>
            <h2 className="text-2xl font-bold text-milk-900 mb-6">Completed Tasks</h2>
            <CompletedTasksList />
          </>
        );
      case 'expired':
        return (
          <>
            <h2 className="text-2xl font-bold text-milk-900 mb-6">Expired Tasks</h2>
            <ExpiredTasksList />
          </>
        );
      default:
        const openTasks = sortedTasks.filter(task => task.status === 'open');
        return openTasks.length > 0 ? (
          <CurrentTask
            task={currentTask}
            onComplete={handleComplete}
            onSkip={handleSkip}
            currentIndex={currentIndex}
            totalTasks={openTasks.length}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-milk-500">No tasks yet. Add your first task!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-milk-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <TaskHeader
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        <div className="flex flex-col items-center justify-center min-h-[400px]">
          {renderContent()}
        </div>
      </div>
      
      <PriorityDialog
        open={showPriorityDialog}
        onOpenChange={setShowPriorityDialog}
        onDowngradePriority={handleDowngradePriority}
        onSplitTask={handleSplitTask}
        onSkipAnyway={() => {
          setShowPriorityDialog(false);
          moveToNextTask();
        }}
      />
      
      <AddTaskDialog onAddTask={(title, priority, expiryDate) => {
        const { addTask } = useTaskStore.getState();
        addTask(title, priority, expiryDate);
      }} />
    </div>
  );
}

export default Index;
