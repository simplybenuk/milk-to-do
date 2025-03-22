
import { useState, useCallback } from 'react';

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
      setInFocusMode(false);
    }
  }, [inFocusMode]);
  
  // Function to confirm exiting focus mode
  const confirmExitFocusMode = useCallback(() => {
    // First exit focus mode
    setInFocusMode(false);
    
    // Then change to the pending view if one exists
    if (pendingView) {
      setTimeout(() => {
        setCurrentView(pendingView);
        setPendingView(null);
      }, 0);
    }
    
    // Hide the confirmation dialog
    setShowExitConfirm(false);
    
    // Ensure any stuck UI state is reset
    setTimeout(() => {
      document.body.style.pointerEvents = "";
    }, 100);
  }, [pendingView]);
  
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
