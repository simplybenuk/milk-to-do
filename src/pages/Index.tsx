import { useState, useEffect } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { useToast } from '@/hooks/use-toast';
import { AllTasksList } from '@/components/AllTasksList';
import { CompletedTasksList } from '@/components/CompletedTasksList';
import { ExpiredTasksList } from '@/components/ExpiredTasksList';
import { PriorityDialog } from '@/components/PriorityDialog';
import { TaskHeader } from '@/components/TaskHeader';
import { CurrentTask } from '@/components/CurrentTask';
import { TaskStats } from '@/components/TaskStats';

const Index = () => {
  const { tasks, completeTask, getTasksByPriority, updateTaskPriority, fetchTasks } = useTaskStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'all' | 'completed' | 'expired' | 'stats'>('main');
  const sortedOpenTasks = getTasksByPriority().filter(task => task.status === 'open');
  const currentTask = sortedOpenTasks[currentIndex];
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleComplete = async (taskId: string) => {
    await completeTask(taskId);
    const remainingTasks = getTasksByPriority().filter(task => task.status === 'open');
    
    if (remainingTasks.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= remainingTasks.length) {
      setCurrentIndex(0);
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
    if (currentIndex >= sortedOpenTasks.length - 1) {
      setCurrentIndex(0);
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

  const handleBlocked = () => {
    toast({
      description: "Moving to next task without updating priority",
    });
    setShowPriorityDialog(false);
    moveToNextTask();
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
      case 'stats':
        return <TaskStats />;
      default:
        return sortedOpenTasks.length > 0 ? (
          <CurrentTask
            task={currentTask}
            onComplete={handleComplete}
            onSkip={handleSkip}
            currentIndex={currentIndex}
            totalTasks={sortedOpenTasks.length}
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
        onBlocked={handleBlocked}
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
