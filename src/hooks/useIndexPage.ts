
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
  
  // Initial data fetching
  useEffect(() => {
    console.log('Index component mounted, fetching tasks...');
    loadTasks();
    
    console.log('App state:', { 
      currentView,
      inFocusMode
    });
  }, [loadTasks, currentView, inFocusMode]);

  // Enter focus mode when explicitly switching to main view
  useEffect(() => {
    if (currentView === 'main' && !inFocusMode) {
      setInFocusMode(true);
      // Make sure pointer events are enabled when entering focus mode
      resetPointerEvents();
    }
  }, [currentView, inFocusMode, setInFocusMode, resetPointerEvents]);
  
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
