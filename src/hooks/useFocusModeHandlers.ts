
import { useCallback, useRef } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { AppView } from '@/hooks/useAppView';

export function useFocusModeHandlers(
  setCurrentView: (view: AppView) => void,
  setInFocusMode: (inFocus: boolean) => void,
  setShowExitConfirm: (show: boolean) => void,
  confirmExitFocusMode: () => void
) {
  const { fetchTasks } = useTaskStore();
  // Use refs to track action states and prevent duplicate actions
  const isExitingRef = useRef(false);
  const isEnteringRef = useRef(false);
  
  // Handler for entering focus mode - memoized to maintain stable reference
  const handleEnterFocusMode = useCallback(() => {
    // Prevent multiple rapid calls
    if (isEnteringRef.current) return;
    isEnteringRef.current = true;
    
    console.log('Entering focus mode');
    // Reset pointer events explicitly before entering focus mode
    document.body.style.pointerEvents = "";
    
    // Just change view, the view handler will enable focus mode
    setCurrentView('main');
    
    // Reset the flag after a small delay
    setTimeout(() => {
      isEnteringRef.current = false;
    }, 100);
  }, [setCurrentView]);

  // Handler for exiting focus mode - memoized to maintain stable reference
  const handleExitFocusMode = useCallback(() => {
    // Prevent multiple rapid calls
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    
    console.log('Initiating focus mode exit');
    // Make sure pointer events are enabled when trying to exit
    document.body.style.pointerEvents = "";
    
    // Simply show the confirmation dialog
    setShowExitConfirm(true);
    
    // Reset the flag after a small delay
    setTimeout(() => {
      isExitingRef.current = false;
    }, 100);
  }, [setShowExitConfirm]);

  // Handler for confirming exit - memoized to maintain stable reference
  const handleConfirmExit = useCallback(() => {
    console.log('Confirming exit from focus mode');
    // Reset pointer events immediately
    document.body.style.pointerEvents = "";
    
    // Let the confirmation handler handle the state changes
    confirmExitFocusMode();
    
    // Refresh tasks after a delay to ensure state updates are complete
    setTimeout(() => {
      fetchTasks();
    }, 300);
  }, [confirmExitFocusMode, fetchTasks]);

  return {
    handleEnterFocusMode,
    handleExitFocusMode,
    handleConfirmExit
  };
}
