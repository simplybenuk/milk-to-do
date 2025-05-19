
import { useEffect, useRef } from 'react';
import { useAppView } from '@/hooks/useAppView';
import { useTaskDataFetching } from '@/hooks/useTaskDataFetching';
import { useBodyStyles } from '@/hooks/useBodyStyles';

/**
 * Main hook for Index page functionality
 */
export function useIndexPage() {
  const { loadTasks } = useTaskDataFetching();
  const { resetPointerEvents } = useBodyStyles();
  const { 
    currentView, 
    setCurrentView, 
    inFocusMode, 
    setInFocusMode, 
    showExitConfirm, 
    setShowExitConfirm, 
    confirmExitFocusMode
  } = useAppView('all');
  
  // Use a ref to track if we've already loaded tasks
  const initialLoadDone = useRef(false);
  
  // Initial data fetching - only run once on mount
  useEffect(() => {
    // Only load tasks once when the component mounts
    if (!initialLoadDone.current) {
      console.log('Index component mounted, fetching tasks...');
      loadTasks();
      initialLoadDone.current = true;
    }
    
    // Ensure pointer events are enabled
    resetPointerEvents();
    
    console.log('App state initialized:', { 
      currentView,
      inFocusMode
    });
  }, []); // No dependencies for initial setup
  
  return {
    currentView,
    setCurrentView,
    inFocusMode,
    setInFocusMode,
    showExitConfirm,
    setShowExitConfirm,
    confirmExitFocusMode
  };
}
