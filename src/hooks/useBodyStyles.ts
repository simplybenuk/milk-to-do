
import { useEffect, useRef } from 'react';

/**
 * Hook for managing body styles like pointer events
 */
export function useBodyStyles() {
  // Track if the interval is active to prevent duplicates
  const intervalRef = useRef<number | null>(null);
  const isRestoringRef = useRef<boolean>(false);
  
  const resetPointerEvents = () => {
    // Prevent redundant style settings which can trigger updates
    if (document.body.style.pointerEvents !== "") {
      document.body.style.pointerEvents = "";
      console.log('Reset pointer events');
    }
  };
  
  // Set up cleanup and maintenance for pointer events
  useEffect(() => {
    // Reset on mount
    resetPointerEvents();
    console.log('Body styles initialized');
    
    // Set up an interval to periodically check and fix pointer-events
    // Only if not already set up
    if (intervalRef.current === null) {
      intervalRef.current = window.setInterval(() => {
        // Use ref to prevent multiple simultaneous resets
        if (!isRestoringRef.current && document.body.style.pointerEvents === 'none') {
          isRestoringRef.current = true;
          resetPointerEvents();
          console.log('Restored pointer-events via interval check');
          setTimeout(() => {
            isRestoringRef.current = false;
          }, 100);
        }
      }, 5000);
    }
    
    // Listen for any page visibility changes to reset pointer events
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resetPointerEvents();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resetPointerEvents();
      console.log('Body styles cleanup completed');
    };
  }, []);
  
  return { resetPointerEvents };
}
