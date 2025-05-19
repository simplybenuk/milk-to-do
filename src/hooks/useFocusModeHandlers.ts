
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
    
    // Just change view, the view handler will enable focus mode
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

  // Handler for confirming exit - removed fetchTasks from dependency array
  const handleConfirmExit = useCallback(() => {
    console.log('Confirming exit from focus mode');
    // Reset pointer events immediately
    document.body.style.pointerEvents = "";
    
    // Let the confirmation handler handle the state changes
    confirmExitFocusMode();
    
    // Refresh tasks after a short delay to ensure state updates are complete
    setTimeout(() => {
      fetchTasks();
    }, 300);
  }, [confirmExitFocusMode]); // Removed fetchTasks from dependency

  return {
    handleEnterFocusMode,
    handleExitFocusMode,
    handleConfirmExit
  };
}
