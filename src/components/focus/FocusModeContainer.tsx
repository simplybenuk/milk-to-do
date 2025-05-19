
import React, { useEffect, useState, useRef } from 'react';
import { FocusModePage } from './FocusModePage';
import { FocusExitConfirmDialog } from '@/components/FocusExitConfirmDialog';
import { useTaskNavigation } from '@/hooks/useTaskNavigation';
import { useFocusModeHandlers } from '@/hooks/useFocusModeHandlers';
import { AppView } from '@/hooks/useAppView';
import { MainContent } from '@/components/MainContent';
import { useFocusModeSync } from '@/hooks/useFocusModeSync';

interface FocusModeContainerProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  inFocusMode: boolean;
  setInFocusMode: (inFocus: boolean) => void;
  showExitConfirm: boolean;
  setShowExitConfirm: (show: boolean) => void;
  confirmExitFocusMode: () => void;
}

export function FocusModeContainer({
  currentView,
  setCurrentView,
  inFocusMode,
  setInFocusMode,
  showExitConfirm,
  setShowExitConfirm,
  confirmExitFocusMode
}: FocusModeContainerProps) {
  const [selectedTagIds, setSelectedTagIdsState] = useState<string[] | undefined>(undefined);
  
  // Prevent infinite rerendering by tracking state changes
  const prevInFocusMode = useRef(inFocusMode);
  const prevCurrentView = useRef(currentView);
  
  // Monitor view and focus mode sync without updating state
  useFocusModeSync(currentView, inFocusMode);
  
  // Initialize focus mode handlers
  const { 
    handleEnterFocusMode, 
    handleExitFocusMode, 
    handleConfirmExit 
  } = useFocusModeHandlers(
    setCurrentView, 
    setInFocusMode, 
    setShowExitConfirm,
    confirmExitFocusMode
  );
  
  // Set up task navigation and handle focus mode end
  const handleFocusEnd = () => {
    // Safely exit focus mode
    console.log("Focus mode session ended naturally");
    document.body.style.pointerEvents = "";
    
    // Exit focus mode and return to All Tasks view
    setInFocusMode(false);
    setTimeout(() => {
      setCurrentView('all'); // Go back to All Tasks view when focus mode ends naturally
    }, 50);
  };
  
  const {
    currentTask,
    currentIndex,
    focusTaskOrder,
    handleComplete,
    handleSkip,
    handleReturnToTop,
    isProcessing,
    setSelectedTagIds,
    noTasksAvailable
  } = useTaskNavigation(inFocusMode, handleFocusEnd);
  
  const handleTagSelection = (tags?: string[]) => {
    setSelectedTagIdsState(tags);
    setSelectedTagIds(tags);
  };

  // Reset pointer events if they get stuck - use a ref to avoid infinite renders
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Only set up the interval once, not on every render
    if (intervalRef.current === null) {
      intervalRef.current = window.setInterval(() => {
        if (document.body.style.pointerEvents === 'none') {
          document.body.style.pointerEvents = "";
          console.log("FocusModeContainer: Restored pointer events");
        }
      }, 5000); // Longer interval to reduce updates
    }
    
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      document.body.style.pointerEvents = "";
    };
  }, []);

  // Track view and focus mode changes to prevent infinite loops
  useEffect(() => {
    prevInFocusMode.current = inFocusMode;
    prevCurrentView.current = currentView;
  }, [inFocusMode, currentView]);

  // If not in focus mode, only show the enter focus mode button
  if (!inFocusMode && currentView === 'all') {
    return (
      <FocusModePage
        currentTask={null}
        currentIndex={0}
        totalTasks={0}
        isProcessing={false}
        onComplete={() => {}}
        onSkip={() => {}}
        onReturnToTop={() => {}}
        onExitFocusMode={() => {}}
        onEnterFocusMode={(tags) => {
          handleTagSelection(tags);
          handleEnterFocusMode();
        }}
        inFocusMode={false}
        currentView={currentView}
      />
    );
  }
  
  // If in focus mode and on main view, show the focus mode content
  if (inFocusMode && currentView === 'main') {
    return (
      <>
        <MainContent
          currentView={currentView}
          currentTask={currentTask}
          onComplete={handleComplete}
          onSkip={handleSkip}
          onReturnToTop={handleReturnToTop}
          currentIndex={currentIndex}
          totalTasks={focusTaskOrder.length}
          inFocusMode={inFocusMode}
          onExitFocusMode={handleExitFocusMode}
          selectedTagIds={selectedTagIds}
          noTasksAvailable={noTasksAvailable}
        />
        
        <FocusExitConfirmDialog
          open={showExitConfirm}
          onOpenChange={setShowExitConfirm}
          onConfirm={handleConfirmExit}
        />
      </>
    );
  }
  
  // For all other scenarios, don't render anything
  return null;
}
