
import { useEffect } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { PriorityDialog } from '@/components/PriorityDialog';
import { SplitTaskDialog } from '@/components/SplitTaskDialog';
import { TaskHeader } from '@/components/TaskHeader';
import { useAppView } from '@/hooks/useAppView';
import { useTaskNavigation } from '@/hooks/useTaskNavigation';
import { MainContent } from '@/components/MainContent';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { fetchTasks, completeTask } = useTaskStore();
  const { currentView, setCurrentView } = useAppView('main');
  const { toast } = useToast();
  
  const {
    currentTask,
    currentIndex,
    sortedOpenTasks,
    showPriorityDialog,
    setShowPriorityDialog,
    showSplitDialog,
    setShowSplitDialog,
    handleSkip,
    handleReturnToTop,
    handleDowngradePriority,
    handleBlocked,
    moveToNextTask,
    handleSplitComplete,
    handleSplitTask,
    taskToSplit
  } = useTaskNavigation();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleComplete = async (taskId: string) => {
    await completeTask(taskId);
    toast({
      title: "Task completed",
      description: "Great job! The task has been marked as complete.",
    });
  };

  // Determine which task to use for the split dialog
  const taskForSplitDialog = taskToSplit || currentTask;

  return (
    <div className="min-h-screen bg-milk-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <TaskHeader
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <MainContent
            currentView={currentView}
            currentTask={currentTask}
            onComplete={handleComplete}
            onSkip={handleSkip}
            onReturnToTop={handleReturnToTop}
            currentIndex={currentIndex}
            sortedOpenTasks={sortedOpenTasks}
          />
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
      
      {taskForSplitDialog && (
        <SplitTaskDialog
          open={showSplitDialog}
          onOpenChange={setShowSplitDialog}
          parentTaskId={taskForSplitDialog.id}
          parentTaskTitle={taskForSplitDialog.title}
          onSplitComplete={handleSplitComplete}
        />
      )}
      
      <AddTaskDialog onAddTask={(title, priority, expiryDate) => {
        const { addTask } = useTaskStore.getState();
        addTask(title, priority, expiryDate);
      }} />
    </div>
  );
}

export default Index;
