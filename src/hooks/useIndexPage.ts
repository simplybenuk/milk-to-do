
import { useEffect, useCallback } from 'react';
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
  
  // Initial data fetching - only run once on mount
  useEffect(() => {
    console.log('Index component mounted, fetching tasks...');
    loadTasks();
    
    // Ensure pointer events are enabled
    resetPointerEvents();
    
    console.log('App state initialized:', { 
      currentView,
      inFocusMode
    });
  }, [loadTasks, resetPointerEvents]); // Include proper dependencies
  
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
