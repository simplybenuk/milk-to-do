
import { useEffect, useRef } from 'react';
import { AppView } from '@/hooks/useAppView';

/**
 * Hook to synchronize focus mode state with the current view
 * This hook only monitors changes and doesn't update state directly
 */
export function useFocusModeSync(
  currentView: AppView,
  inFocusMode: boolean
) {
  // Use refs to track previous values to avoid unnecessary effects
  const prevViewRef = useRef<AppView>(currentView);
  const prevFocusModeRef = useRef<boolean>(inFocusMode);
  
  // Effect to log focus mode state changes based on view changes
  useEffect(() => {
    // Only run effect if the view or focus mode state has actually changed
    const viewChanged = prevViewRef.current !== currentView;
    const focusModeChanged = prevFocusModeRef.current !== inFocusMode;
    
    if (viewChanged || focusModeChanged) {
      console.log('Focus mode sync detected change:', { 
        prevView: prevViewRef.current,
        currentView,
        prevFocusMode: prevFocusModeRef.current,
        inFocusMode
      });
      
      // Update the refs to the current values
      prevViewRef.current = currentView;
      prevFocusModeRef.current = inFocusMode;
    }
  }, [currentView, inFocusMode]);
  
  // Cleanup on unmount - ensure pointer events are enabled
  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "";
    };
  }, []);
}
