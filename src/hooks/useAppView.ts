
import { useState, useCallback, useEffect } from 'react';

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
      setInFocusMode(false); // Ensure focus mode is turned off when not on main view
    }
  }, [inFocusMode]);
  
  // Function to confirm exiting focus mode
  const confirmExitFocusMode = useCallback(() => {
    // Reset any pointer-events styles that might be blocking interactions
    document.body.style.pointerEvents = '';
    
    // Then change to the pending view if one exists
    if (pendingView) {
      setCurrentView(pendingView);
      setPendingView(null);
      setInFocusMode(false); // Ensure focus mode is turned off
    }
  }, [pendingView]);
  
  // Effect to ensure inFocusMode is synced with currentView
  useEffect(() => {
    if (currentView !== 'main' && inFocusMode) {
      // If we're not on the main view but somehow focus mode is still on, turn it off
      setInFocusMode(false);
    }
  }, [currentView, inFocusMode]);
  
  // Global cleanup effect to ensure pointer events are never stuck
  useEffect(() => {
    const cleanup = () => {
      document.body.style.pointerEvents = '';
    };
    
    // Clean up on component unmount
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
