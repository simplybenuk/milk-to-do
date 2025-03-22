
import { useEffect } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { TaskHeader } from '@/components/TaskHeader';
import { useAppView } from '@/hooks/useAppView';
import { useTaskNavigation } from '@/hooks/useTaskNavigation';
import { MainContent } from '@/components/MainContent';
import { useToast } from '@/hooks/use-toast';
import { FocusExitConfirmDialog } from '@/components/FocusExitConfirmDialog';
import { Button } from '@/components/ui/button';
import { Focus } from 'lucide-react';

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
  } = useAppView('all');
  const { toast } = useToast();
  
  // Initialize focus mode or end it
  const handleFocusEnd = () => {
    setInFocusMode(false);
    fetchTasks(); // Refresh tasks to update priority scores
    
    // Ensure interactivity is restored
    document.body.style.pointerEvents = "";
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

  // Enter focus mode when explicitly switching to main view
  useEffect(() => {
    if (currentView === 'main' && !inFocusMode) {
      setInFocusMode(true);
    }
  }, [currentView, inFocusMode, setInFocusMode]);

  // Handler for confirming exit
  const handleConfirmExit = () => {
    // Reset pointer events immediately
    document.body.style.pointerEvents = "";
    
    // Process the exit confirmation
    confirmExitFocusMode();
    
    // Refresh tasks with a delay to ensure state updates first
    setTimeout(() => {
      fetchTasks();
    }, 100);
  };

  // Handler for entering focus mode
  const handleEnterFocusMode = () => {
    setCurrentView('main');
  };

  // Global cleanup for pointer events
  useEffect(() => {
    // Reset on mount
    document.body.style.pointerEvents = "";
    
    // Set up an interval to periodically check and fix pointer-events
    // This is a failsafe in case other mechanisms fail
    const intervalId = setInterval(() => {
      if (document.body.style.pointerEvents === 'none') {
        document.body.style.pointerEvents = '';
      }
    }, 2000);
    
    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      document.body.style.pointerEvents = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-milk-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <TaskHeader
          currentView={currentView}
          onViewChange={setCurrentView}
          inFocusMode={inFocusMode}
        />

        {currentView === 'all' && !inFocusMode && (
          <div className="mb-6 flex justify-center">
            <Button 
              onClick={handleEnterFocusMode}
              className="bg-milk-600 hover:bg-milk-700 text-white"
            >
              <Focus className="mr-2 h-4 w-4" />
              Enter Focus Mode
            </Button>
          </div>
        )}

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
