
import { useState } from 'react';

export type AppView = 'main' | 'all' | 'closed' | 'stats';

export function useAppView(initialView: AppView = 'main') {
  const [currentView, setCurrentView] = useState<AppView>(initialView);
  const [inFocusMode, setInFocusMode] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingView, setPendingView] = useState<AppView | null>(null);
  
  // Function to handle view changes with focus mode confirmation
  const handleViewChange = (newView: AppView) => {
    if (inFocusMode && newView !== 'main') {
      setPendingView(newView);
      setShowExitConfirm(true);
      return;
    }
    
    setCurrentView(newView);
    if (newView !== 'main') {
      setInFocusMode(false);
    }
  };
  
  // Function to confirm exiting focus mode
  const confirmExitFocusMode = () => {
    setInFocusMode(false);
    if (pendingView) {
      setCurrentView(pendingView);
      setPendingView(null);
    }
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
