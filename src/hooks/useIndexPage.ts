
import { useEffect } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useAppView } from '@/hooks/useAppView';
import { useToast } from '@/hooks/use-toast';

export function useIndexPage() {
  const { fetchTasks } = useTaskStore();
  const { toast } = useToast();
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
    try {
      fetchTasks().catch(err => {
        console.error('Error fetching tasks:', err);
        toast({
          title: 'Error fetching tasks',
          description: 'Please try refreshing the page',
          variant: 'destructive',
        });
      });
    } catch (err) {
      console.error('Exception in fetchTasks:', err);
    }
    
    console.log('App state:', { 
      currentView,
      inFocusMode
    });
  }, [fetchTasks, toast, currentView, inFocusMode]);

  // Enter focus mode when explicitly switching to main view
  useEffect(() => {
    if (currentView === 'main' && !inFocusMode) {
      setInFocusMode(true);
      // Make sure pointer events are enabled when entering focus mode
      document.body.style.pointerEvents = "";
    }
  }, [currentView, inFocusMode, setInFocusMode]);

  // Global cleanup for pointer events
  useEffect(() => {
    // Reset on mount
    document.body.style.pointerEvents = "";
    console.log('Index component initialized');
    
    // Set up an interval to periodically check and fix pointer-events
    // This is a failsafe in case other mechanisms fail
    const intervalId = setInterval(() => {
      if (document.body.style.pointerEvents === 'none') {
        document.body.style.pointerEvents = '';
        console.log('Restored pointer-events via interval check');
      }
    }, 2000);
    
    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      document.body.style.pointerEvents = "";
      console.log('Index component unmounted');
    };
  }, []);
  
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
