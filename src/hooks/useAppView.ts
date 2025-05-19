
import { useState, useCallback, useRef, useEffect } from 'react';

export type AppView = 'main' | 'all' | 'closed' | 'stats';

export function useAppView(initialView: AppView = 'all') {
  // Primary state
  const [currentView, setCurrentView] = useState<AppView>(initialView);
  const [inFocusMode, setInFocusMode] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingView, setPendingView] = useState<AppView | null>(null);
  
  // Use refs to track previous values to prevent unnecessary effects
  const prevViewRef = useRef<AppView>(initialView);
  const prevInFocusModeRef = useRef<boolean>(false);
  
  // Handle view changes with focus mode confirmation
  const handleViewChange = useCallback((newView: AppView) => {
    // Don't do anything if already on this view
    if (newView === currentView) return;

    if (inFocusMode && newView !== 'main') {
      // Store the requested view and show confirmation dialog
      console.log(`Requesting view change to ${newView} while in focus mode, showing confirmation`);
      setPendingView(newView);
      setShowExitConfirm(true);
      return;
    }
    
    // If not in focus mode or switching to main, change view directly
    console.log(`Changing view from ${currentView} to ${newView}`);
    setCurrentView(newView);
    
    // When explicitly switching to main view, enter focus mode
    if (newView === 'main' && !inFocusMode) {
      console.log('Setting focus mode to true because switching to main view');
      setInFocusMode(true);
    }
  }, [inFocusMode, currentView]);

  // Log state changes for debugging but avoid infinite loops
  useEffect(() => {
    // Only log if there was an actual change
    if (prevViewRef.current !== currentView) {
      console.log(`View changed from ${prevViewRef.current} to ${currentView}`);
      prevViewRef.current = currentView;
    }
    
    if (prevInFocusModeRef.current !== inFocusMode) {
      console.log(`Focus mode changed from ${prevInFocusModeRef.current} to ${inFocusMode}`);
      prevInFocusModeRef.current = inFocusMode;
    }
  }, [currentView, inFocusMode]);

  // Function to confirm exiting focus mode - consolidating multiple state updates
  const confirmExitFocusMode = useCallback(() => {
    console.log('Confirming exit from focus mode, pending view:', pendingView);
    
    // First disable focus mode
    setInFocusMode(false);
    
    // Reset dialog state
    setShowExitConfirm(false);
    
    // Delay view change to avoid race conditions
    const targetView = pendingView || 'all';
    setTimeout(() => {
      setCurrentView(targetView);
      setPendingView(null);
      
      // Reset pointer events
      document.body.style.pointerEvents = '';
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
