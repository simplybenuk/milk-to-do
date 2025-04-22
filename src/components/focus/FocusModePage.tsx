
import React from 'react';
import { Button } from '@/components/ui/button';
import { Focus } from 'lucide-react';

interface FocusModePageProps {
  currentTask: any;
  currentIndex: number;
  totalTasks: number;
  isProcessing: boolean;
  onComplete: (taskId: string) => void;
  onSkip: () => void;
  onReturnToTop: () => void;
  onExitFocusMode: () => void;
  onEnterFocusMode: () => void;
  inFocusMode: boolean;
  currentView: 'main' | 'all' | 'closed' | 'stats';
}

export function FocusModePage({
  onEnterFocusMode,
  inFocusMode,
  currentView
}: FocusModePageProps) {
  
  // Only show the focus mode button on the All Tasks view when not in focus mode
  if (!inFocusMode && currentView === 'all') {
    return (
      <div className="mb-6 flex justify-center">
        <Button 
          onClick={onEnterFocusMode}
          className="bg-milk-600 hover:bg-milk-700 text-white animate-fade-in"
        >
          <Focus className="mr-2 h-4 w-4" />
          Enter Focus Mode
        </Button>
      </div>
    );
  }
  
  // For all other scenarios, don't render anything
  // This allows other components to control the content
  return null;
}
