
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
  }, [inFocusMode]);

  // Function to confirm exiting focus mode
  const confirmExitFocusMode = useCallback(() => {
    console.log('Confirming exit from focus mode, pending view:', pendingView);
    
    // First disable focus mode, but do it directly to avoid triggering effects
    const newView = pendingView || 'all';
    
    // Update state in the correct order to avoid race conditions
    setInFocusMode(false);
    setCurrentView(newView);
    setPendingView(null);
    setShowExitConfirm(false);
  }, [pendingView]);
  
  // Use a custom hook to synchronize focus mode with view changes
  // but deliberately avoid passing the setter to prevent circular updates
  useEffect(() => {
    // Only sync when changing TO main view (entering focus mode)
    if (currentView === 'main' && !inFocusMode) {
      console.log('Setting focus mode for main view');
      setInFocusMode(true);
    }
    
    // Make sure pointer events are always enabled
    document.body.style.pointerEvents = '';
  }, [currentView, inFocusMode]);
  
  // Effect to ensure focus mode is disabled when leaving main view
  useEffect(() => {
    // Only sync when changing FROM main view (exiting focus mode)
    if (currentView !== 'main' && inFocusMode && !showExitConfirm) {
      console.log('Auto-disabling focus mode when leaving main view');
      setInFocusMode(false);
    }
  }, [currentView, inFocusMode, showExitConfirm]);
  
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
