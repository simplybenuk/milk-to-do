
import React from 'react';
import { Button } from '@/components/ui/button';
import { Focus } from 'lucide-react';
import { MainContent } from '@/components/MainContent';

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
  currentTask,
  currentIndex,
  totalTasks,
  onComplete,
  onSkip,
  onReturnToTop,
  onExitFocusMode,
  onEnterFocusMode,
  inFocusMode,
  currentView
}: FocusModePageProps) {
  
  // Render the focus mode button when not in focus mode
  if (currentView === 'all' && !inFocusMode) {
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
  
  // Render the focus mode content
  return (
    <MainContent
      currentView={currentView}
      currentTask={currentTask}
      onComplete={onComplete}
      onSkip={onSkip}
      onReturnToTop={onReturnToTop}
      currentIndex={currentIndex}
      totalTasks={totalTasks}
      inFocusMode={inFocusMode}
      onExitFocusMode={onExitFocusMode}
    />
  );
}
