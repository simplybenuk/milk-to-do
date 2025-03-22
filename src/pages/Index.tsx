
import { useEffect } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { TaskHeader } from '@/components/TaskHeader';
import { useAppView } from '@/hooks/useAppView';
import { useTaskNavigation } from '@/hooks/useTaskNavigation';
import { MainContent } from '@/components/MainContent';
import { useToast } from '@/hooks/use-toast';
import { FocusExitConfirmDialog } from '@/components/FocusExitConfirmDialog';

const Index = () => {
  const { fetchTasks } = useTaskStore();
  const { 
    currentView, 
    setCurrentView, 
    inFocusMode, 
    setInFocusMode, 
    showExitConfirm, 
    setShowExitConfirm, 
    confirmExitFocusMode,
    pendingView
  } = useAppView('main');
  const { toast } = useToast();
  
  // Initialize focus mode or end it
  const handleFocusEnd = () => {
    setInFocusMode(false);
    fetchTasks(); // Refresh tasks to update priority scores
  };
  
  const {
    currentTask,
    currentIndex,
    focusTaskOrder,
    handleComplete,
    handleSkip,
    handleReturnToTop,
    isProcessing
  } = useTaskNavigation(inFocusMode, handleFocusEnd);

  // Fetch tasks on initial render
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Enter focus mode when viewing main screen
  useEffect(() => {
    if (currentView === 'main' && !inFocusMode) {
      setInFocusMode(true);
    }
  }, [currentView, inFocusMode, setInFocusMode]);

  // Handler for confirming exit
  const handleConfirmExit = () => {
    confirmExitFocusMode();
    // Refresh tasks after exiting focus mode
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-milk-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <TaskHeader
          currentView={currentView}
          onViewChange={setCurrentView}
          inFocusMode={inFocusMode}
        />

        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <MainContent
            currentView={currentView}
            currentTask={currentTask}
            onComplete={handleComplete}
            onSkip={handleSkip}
            onReturnToTop={handleReturnToTop}
            currentIndex={currentIndex}
            totalTasks={focusTaskOrder.length}
            inFocusMode={inFocusMode}
          />
        </div>
      </div>
      
      <FocusExitConfirmDialog
        open={showExitConfirm}
        onOpenChange={setShowExitConfirm}
        onConfirm={handleConfirmExit}
      />
      
      <AddTaskDialog onAddTask={(title, priority, expiryDate) => {
        const { addTask } = useTaskStore.getState();
        addTask(title, priority, expiryDate);
      }} />
    </div>
  );
}

export default Index;
