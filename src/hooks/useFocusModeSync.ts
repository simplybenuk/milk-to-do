
import { useEffect, useRef } from 'react';
import { AppView } from '@/hooks/useAppView';

/**
 * Hook to synchronize focus mode state with the current view
 * This hook is now simplified to only handle one-way synchronization:
 * - disabling focus mode when leaving the main view
 */
export function useFocusModeSync(
  currentView: AppView,
  inFocusMode: boolean,
  setInFocusMode: (value: boolean) => void
) {
  // Use refs to track previous values to avoid unnecessary state updates
  const prevViewRef = useRef<AppView>(currentView);
  const prevFocusModeRef = useRef<boolean>(inFocusMode);
  
  // Effect to handle focus mode state changes based on view changes
  useEffect(() => {
    // Only run effect if the view or focus mode state has actually changed
    if (prevViewRef.current !== currentView || prevFocusModeRef.current !== inFocusMode) {
      // If changing away from main view and in focus mode, disable focus mode
      if (currentView !== 'main' && inFocusMode) {
        console.log('useFocusModeSync: Auto-disabling focus mode due to view change');
        setInFocusMode(false);
      }
      
      // Update the refs to the current values
      prevViewRef.current = currentView;
      prevFocusModeRef.current = inFocusMode;
    }
  }, [currentView, inFocusMode, setInFocusMode]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Make sure pointer events are always enabled when unmounting
      document.body.style.pointerEvents = "";
    };
  }, []);
}
