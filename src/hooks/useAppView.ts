
import { useState, useCallback, useEffect, useRef } from 'react';

export type AppView = 'main' | 'all' | 'closed' | 'stats';

export function useAppView(initialView: AppView = 'all') {
  const [currentView, setCurrentView] = useState<AppView>(initialView);
  const [inFocusMode, setInFocusMode] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingView, setPendingView] = useState<AppView | null>(null);
  
  // Use refs to track previous state and avoid unnecessary effects
  const prevViewRef = useRef<AppView>(currentView);
  
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
  }, [inFocusMode, currentView]);

  // Function to confirm exiting focus mode
  const confirmExitFocusMode = useCallback(() => {
    console.log('Confirming exit from focus mode, pending view:', pendingView);
    
    // Update state in a specific order to avoid race conditions
    const newView = pendingView || 'all';
    
    // Use refs and a single state update with callback to prevent multiple renders
    setInFocusMode(false);
    
    // We'll set the view in a separate callback to ensure state batching
    setTimeout(() => {
      setCurrentView(newView);
      setPendingView(null);
      setShowExitConfirm(false); 
      
      // Make sure pointer events are enabled
      document.body.style.pointerEvents = '';
    }, 0);
  }, [pendingView]);
  
  // Effect for handling view changes to main view (entering focus mode)
  useEffect(() => {
    if (prevViewRef.current !== currentView) {
      // Only sync when changing TO main view
      if (currentView === 'main' && !inFocusMode) {
        console.log('Setting focus mode for main view');
        setInFocusMode(true);
      }
      
      // Update the ref
      prevViewRef.current = currentView;
    }
    
    // Make sure pointer events are always enabled
    document.body.style.pointerEvents = '';
  }, [currentView, inFocusMode]);
  
  // Effect for handling leaving main view (exiting focus mode)
  useEffect(() => {
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
