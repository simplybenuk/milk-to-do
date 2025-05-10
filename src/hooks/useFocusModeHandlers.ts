
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
    console.log('Entering focus mode');
    // Reset pointer events explicitly before entering focus mode
    document.body.style.pointerEvents = "";
    
    // Change view first, let useAppView handle setting focus mode
    setCurrentView('main');
  }, [setCurrentView]);

  // Handler for exiting focus mode
  const handleExitFocusMode = useCallback(() => {
    console.log('Initiating focus mode exit');
    // Make sure pointer events are enabled when trying to exit
    document.body.style.pointerEvents = "";
    
    // Simply show the confirmation dialog
    setShowExitConfirm(true);
  }, [setShowExitConfirm]);

  // Handler for confirming exit
  const handleConfirmExit = useCallback(() => {
    console.log('Confirming exit from focus mode');
    // Reset pointer events immediately
    document.body.style.pointerEvents = "";
    
    // Let the confirmation handler handle the state changes
    confirmExitFocusMode();
    
    // Refresh tasks after a short delay to ensure state updates are complete
    setTimeout(() => {
      fetchTasks();
    }, 300); // Increased delay for more reliable state updates
  }, [confirmExitFocusMode, fetchTasks]);

  return {
    handleEnterFocusMode,
    handleExitFocusMode,
    handleConfirmExit
  };
}
