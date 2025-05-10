
import { useEffect } from 'react';
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
    
    console.log('App state:', { 
      currentView,
      inFocusMode
    });
  }, [loadTasks]); // Remove currentView and inFocusMode from dependencies
  
  // We'll remove this effect since useFocusModeSync now handles this logic
  // This avoids duplicate state updates that cause the infinite loop
  
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
