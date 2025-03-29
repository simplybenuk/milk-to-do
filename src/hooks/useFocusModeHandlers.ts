
import { useCallback } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { AppView } from '@/hooks/useAppView';

export function useFocusModeHandlers(
  setCurrentView: (view: AppView) => void,
  setInFocusMode: (inFocus: boolean) => void,
  setShowExitConfirm: (show: boolean) => void,
  confirmExitFocusMode: () => void
) {
  const { fetchTasks } = useTaskStore();
  
  // Handler for entering focus mode
  const handleEnterFocusMode = useCallback(() => {
    // Reset pointer events explicitly before entering focus mode
    document.body.style.pointerEvents = "";
    setCurrentView('main');
  }, [setCurrentView]);

  // Handler for exiting focus mode
  const handleExitFocusMode = useCallback(() => {
    // Make sure pointer events are enabled when trying to exit
    document.body.style.pointerEvents = "";
    setShowExitConfirm(true);
  }, [setShowExitConfirm]);

  // Handler for confirming exit
  const handleConfirmExit = useCallback(() => {
    console.log("Confirming exit from focus mode");
    
    // Reset pointer events immediately
    document.body.style.pointerEvents = "";
    
    // Critical fix: Change the view FIRST to 'all' to force exit from focus mode
    setCurrentView('all');
    
    // Then set focus mode to false 
    setInFocusMode(false);
    
    // Process the exit confirmation
    confirmExitFocusMode();
    
    // Refresh tasks after state updates
    setTimeout(() => {
      fetchTasks();
    }, 0);
  }, [setInFocusMode, setCurrentView, confirmExitFocusMode, fetchTasks]);

  return {
    handleEnterFocusMode,
    handleExitFocusMode,
    handleConfirmExit
  };
}
