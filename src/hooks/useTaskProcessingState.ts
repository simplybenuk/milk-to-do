
import { useState } from 'react';

/**
 * Hook for managing task processing state
 * @returns Processing state and setter
 */
export function useTaskProcessingState() {
  const [isProcessing, setIsProcessing] = useState(false);
  
  return {
    isProcessing,
    setIsProcessing,
    startProcessing: () => setIsProcessing(true),
    stopProcessing: () => setIsProcessing(false)
  };
}
