
import { useState } from 'react';

export type AppView = 'main' | 'all' | 'closed' | 'stats';

export function useAppView(initialView: AppView = 'all') {
  const [currentView, setCurrentView] = useState<AppView>(initialView);
  const [inFocusMode, setInFocusMode] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingView, setPendingView] = useState<AppView | null>(null);
  
  // Function to handle view changes with focus mode confirmation
  const handleViewChange = (newView: AppView) => {
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
  };
  
  // Function to confirm exiting focus mode
  const confirmExitFocusMode = () => {
    // Exit focus mode
    setInFocusMode(false);
    
    // Change to the pending view if one exists
    if (pendingView) {
      setCurrentView(pendingView);
      setPendingView(null);
    }
    
    // Hide the confirmation dialog
    setShowExitConfirm(false);
  };
  
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
