
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
  
  // Only render MainContent for Focus Mode if actually in focus mode
  if (inFocusMode && currentView === 'main') {
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
  
  // For all other views, don't render anything
  // This allows the content to be controlled by Index.tsx
  return null;
}
