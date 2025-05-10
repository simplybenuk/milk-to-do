
import { useEffect } from 'react';

/**
 * Hook for managing body styles like pointer events
 */
export function useBodyStyles() {
  const resetPointerEvents = () => {
    document.body.style.pointerEvents = "";
  };
  
  // Set up cleanup and maintenance for pointer events
  useEffect(() => {
    // Reset on mount
    resetPointerEvents();
    console.log('Body styles initialized');
    
    // Set up an interval to periodically check and fix pointer-events
    // This is a failsafe in case other mechanisms fail
    const intervalId = setInterval(() => {
      if (document.body.style.pointerEvents === 'none') {
        resetPointerEvents();
        console.log('Restored pointer-events via interval check');
      }
    }, 2000);
    
    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      resetPointerEvents();
      console.log('Body styles cleanup completed');
    };
  }, []);
  
  return { resetPointerEvents };
}
