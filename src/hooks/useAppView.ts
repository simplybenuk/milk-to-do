
import { useState, useCallback, useRef, useEffect } from 'react';

export type AppView = 'main' | 'all' | 'closed' | 'stats';

export function useAppView(initialView: AppView = 'all') {
  const [currentView, setCurrentView] = useState<AppView>(initialView);
  const [inFocusMode, setInFocusMode] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingView, setPendingView] = useState<AppView | null>(null);
  
  // Use refs to track previous values and prevent unnecessary effects
  const prevViewRef = useRef<AppView>(initialView);
  const prevInFocusModeRef = useRef<boolean>(false);
  
  // Function to handle view changes with focus mode confirmation
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
      // Use timeout to ensure state batching
      setTimeout(() => {
        setInFocusMode(true);
      }, 0);
    }
  }, [inFocusMode, currentView]);

  // Monitor state changes to avoid infinite updates
  useEffect(() => {
    if (prevViewRef.current !== currentView) {
      console.log(`View changed from ${prevViewRef.current} to ${currentView}`);
      prevViewRef.current = currentView;
    }
    
    if (prevInFocusModeRef.current !== inFocusMode) {
      console.log(`Focus mode changed from ${prevInFocusModeRef.current} to ${inFocusMode}`);
      prevInFocusModeRef.current = inFocusMode;
    }
  }, [currentView, inFocusMode]);

  // Function to confirm exiting focus mode
  const confirmExitFocusMode = useCallback(() => {
    console.log('Confirming exit from focus mode, pending view:', pendingView);
    
    // Update state in a specific order to avoid race conditions
    setInFocusMode(false);
    
    // We'll set the view in a separate callback to ensure state batching
    setTimeout(() => {
      // If there's a pending view, switch to it; otherwise, go back to 'all'
      if (pendingView) {
        setCurrentView(pendingView);
      } else {
        setCurrentView('all');
      }
      setPendingView(null);
      setShowExitConfirm(false);
      
      // Make sure pointer events are enabled
      document.body.style.pointerEvents = '';
    }, 50); // Increased timeout to ensure state updates are processed
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
