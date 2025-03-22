
import { useState } from 'react';

export type AppView = 'main' | 'all' | 'closed' | 'stats';

export function useAppView(initialView: AppView = 'main') {
  const [currentView, setCurrentView] = useState<AppView>(initialView);
  const [inFocusMode, setInFocusMode] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  // Function to handle view changes with focus mode confirmation
  const handleViewChange = (newView: AppView) => {
    if (inFocusMode && newView !== 'main') {
      setShowExitConfirm(true);
      return;
    }
    
    setCurrentView(newView);
    if (newView !== 'main') {
      setInFocusMode(false);
    }
  };
  
  // Function to confirm exiting focus mode
  const confirmExitFocusMode = (newView: AppView) => {
    setInFocusMode(false);
    setCurrentView(newView);
    setShowExitConfirm(false);
  };
  
  return {
    currentView,
    setCurrentView: handleViewChange,
    inFocusMode,
    setInFocusMode,
    showExitConfirm,
    setShowExitConfirm,
    confirmExitFocusMode
  };
}
