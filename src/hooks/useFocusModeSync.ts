
import { useEffect, useRef } from 'react';
import { AppView } from '@/hooks/useAppView';

/**
 * Hook to synchronize focus mode state with the current view
 */
export function useFocusModeSync(
  currentView: AppView,
  inFocusMode: boolean,
  setInFocusMode: (value: boolean) => void
) {
  // Use refs to track previous values to avoid unnecessary state updates
  const prevViewRef = useRef<AppView>(currentView);
  
  // Effect to handle focus mode state changes based on view changes
  useEffect(() => {
    // Only run effect if the view has actually changed
    if (prevViewRef.current !== currentView) {
      console.log(`View changed from ${prevViewRef.current} to ${currentView}`);
      
      // If changing to main view and not already in focus mode
      if (currentView === 'main' && !inFocusMode) {
        console.log('Syncing focus mode: enabling for main view');
        setInFocusMode(true);
      }
      // If changing away from main view and in focus mode
      else if (currentView !== 'main' && inFocusMode) {
        console.log('Auto-disabling focus mode due to view change');
        setInFocusMode(false);
      }
      
      // Update the ref to the current view
      prevViewRef.current = currentView;
    }
    
    // Make sure pointer events are always enabled
    document.body.style.pointerEvents = "";
  }, [currentView, inFocusMode, setInFocusMode]);
}
