
import { useEffect } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { TaskHeader } from '@/components/TaskHeader';
import { useAppView } from '@/hooks/useAppView';
import { useTaskNavigation } from '@/hooks/useTaskNavigation';
import { useToast } from '@/hooks/use-toast';
import { FocusExitConfirmDialog } from '@/components/FocusExitConfirmDialog';
import { FocusModePage } from '@/components/focus/FocusModePage';
import { PageContainer } from '@/components/layout/PageContainer';
import { useFocusModeHandlers } from '@/hooks/useFocusModeHandlers';

const Index = () => {
  const { fetchTasks } = useTaskStore();
  const { 
    currentView, 
    setCurrentView, 
    inFocusMode, 
    setInFocusMode, 
    showExitConfirm, 
    setShowExitConfirm, 
    confirmExitFocusMode
  } = useAppView('all');
  const { toast } = useToast();
  
  // Initialize focus mode handlers
  const { 
    handleEnterFocusMode, 
    handleExitFocusMode, 
    handleConfirmExit 
  } = useFocusModeHandlers(
    setCurrentView, 
    setInFocusMode, 
    setShowExitConfirm,
    confirmExitFocusMode
  );
  
  // Initialize focus mode or end it
  const handleFocusEnd = () => {
    setInFocusMode(false);
    fetchTasks(); // Refresh tasks to update priority scores
    
    // Ensure interactivity is restored immediately
    document.body.style.pointerEvents = "";
  };
  
  // Set up task navigation
  const {
    currentTask,
    currentIndex,
    focusTaskOrder,
    handleComplete,
    handleSkip,
    handleReturnToTop,
    isProcessing
  } = useTaskNavigation(inFocusMode, handleFocusEnd);

  // Initial data fetching
  useEffect(() => {
    console.log('Index component mounted, fetching tasks...');
    try {
      fetchTasks().catch(err => {
        console.error('Error fetching tasks:', err);
        toast({
          title: 'Error fetching tasks',
          description: 'Please try refreshing the page',
          variant: 'destructive',
        });
      });
    } catch (err) {
      console.error('Exception in fetchTasks:', err);
    }
    
    console.log('App state:', { 
      currentView,
      inFocusMode
    });
  }, [fetchTasks, toast, currentView, inFocusMode]);

  // Enter focus mode when explicitly switching to main view
  useEffect(() => {
    if (currentView === 'main' && !inFocusMode) {
      setInFocusMode(true);
      // Make sure pointer events are enabled when entering focus mode
      document.body.style.pointerEvents = "";
    }
  }, [currentView, inFocusMode, setInFocusMode]);

  // Global cleanup for pointer events
  useEffect(() => {
    // Reset on mount
    document.body.style.pointerEvents = "";
    console.log('Index component initialized');
    
    // Set up an interval to periodically check and fix pointer-events
    // This is a failsafe in case other mechanisms fail
    const intervalId = setInterval(() => {
      if (document.body.style.pointerEvents === 'none') {
        document.body.style.pointerEvents = '';
        console.log('Restored pointer-events via interval check');
      }
    }, 2000);
    
    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      document.body.style.pointerEvents = "";
      console.log('Index component unmounted');
    };
  }, []);

  return (
    <PageContainer inFocusMode={inFocusMode}>
      <TaskHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        inFocusMode={inFocusMode}
      />

      <FocusModePage
        currentTask={currentTask}
        currentIndex={currentIndex}
        totalTasks={focusTaskOrder.length}
        isProcessing={isProcessing}
        onComplete={handleComplete}
        onSkip={handleSkip}
        onReturnToTop={handleReturnToTop}
        onExitFocusMode={handleExitFocusMode}
        onEnterFocusMode={handleEnterFocusMode}
        inFocusMode={inFocusMode}
        currentView={currentView}
      />
      
      <FocusExitConfirmDialog
        open={showExitConfirm}
        onOpenChange={setShowExitConfirm}
        onConfirm={handleConfirmExit}
      />
      
      {/* Only show the AddTaskDialog when not in focus mode */}
      {!inFocusMode && (
        <AddTaskDialog onAddTask={(title, priority, expiryDate) => {
          const { addTask } = useTaskStore.getState();
          addTask(title, priority, expiryDate);
        }} />
      )}
    </PageContainer>
  );
}

export default Index;
