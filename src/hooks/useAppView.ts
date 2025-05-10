
import { useState, useCallback, useEffect } from 'react';
import { useFocusModeSync } from './useFocusModeSync';

export type AppView = 'main' | 'all' | 'closed' | 'stats';

export function useAppView(initialView: AppView = 'all') {
  const [currentView, setCurrentView] = useState<AppView>(initialView);
  const [inFocusMode, setInFocusMode] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingView, setPendingView] = useState<AppView | null>(null);
  
  // Function to handle view changes with focus mode confirmation
  const handleViewChange = useCallback((newView: AppView) => {
    if (inFocusMode && newView !== 'main') {
      // Store the requested view and show confirmation dialog
      setPendingView(newView);
      setShowExitConfirm(true);
      return;
    }
    
    // If not in focus mode or switching to main, change view directly
    setCurrentView(newView);
    if (newView !== 'main') {
      console.log('Exiting focus mode due to view change to:', newView);
      setInFocusMode(false);
    }
  }, [inFocusMode]);

  // Function to confirm exiting focus mode
  const confirmExitFocusMode = useCallback(() => {
    console.log('Confirming exit from focus mode, pending view:', pendingView);
    // First disable focus mode
    setInFocusMode(false);
    
    // Then change the view (either to pending or 'all')
    if (pendingView) {
      setCurrentView(pendingView);
      setPendingView(null);
    } else {
      setCurrentView('all');
    }
    
    // Finally close the confirmation dialog
    setShowExitConfirm(false);
  }, [pendingView]);
  
  // Use our custom focus mode sync hook
  useFocusModeSync(currentView, inFocusMode, setInFocusMode);
  
  // Effect to ensure pointer events are never stuck
  useEffect(() => {
    const cleanup = () => {
      document.body.style.pointerEvents = '';
    };
    
    // Clean up on unmount
    return cleanup;
  }, []);
  
  return {
    currentView,
    setCurrentView: handleViewChange,
    inFocusMode,
    setInFocusMode,
    showExitConfirm,
    setShowExitConfirm,
    confirmExitFocusMode,
    pendingView
  };
}
