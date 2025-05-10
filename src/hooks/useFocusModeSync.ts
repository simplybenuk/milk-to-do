
import { useEffect } from 'react';
import { AppView } from '@/hooks/useAppView';

/**
 * Hook to synchronize focus mode state with the current view
 */
export function useFocusModeSync(
  currentView: AppView,
  inFocusMode: boolean,
  setInFocusMode: (value: boolean) => void
) {
  // Effect to ensure focus mode state is synced with current view
  useEffect(() => {
    if (currentView === 'main' && !inFocusMode) {
      setInFocusMode(true);
      // Make sure pointer events are enabled when entering focus mode
      document.body.style.pointerEvents = "";
    }
  }, [currentView, inFocusMode, setInFocusMode]);

  // Effect to ensure focus mode is disabled when not in main view
  useEffect(() => {
    if (currentView !== 'main' && inFocusMode) {
      console.log('Auto-disabling focus mode due to view change');
      setInFocusMode(false);
    }
  }, [currentView, inFocusMode, setInFocusMode]);
}
