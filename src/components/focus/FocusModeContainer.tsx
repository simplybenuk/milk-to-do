
import React, { useEffect } from 'react';
import { FocusModePage } from './FocusModePage';
import { FocusExitConfirmDialog } from '@/components/FocusExitConfirmDialog';
import { useTaskNavigation } from '@/hooks/useTaskNavigation';
import { useFocusModeHandlers } from '@/hooks/useFocusModeHandlers';
import { AppView } from '@/hooks/useAppView';

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
    setInFocusMode(false);
    
    // Ensure interactivity is restored immediately
    document.body.style.pointerEvents = "";
  };
  
  const {
    currentTask,
    currentIndex,
    focusTaskOrder,
    handleComplete,
    handleSkip,
    handleReturnToTop,
    isProcessing
  } = useTaskNavigation(inFocusMode, handleFocusEnd);

  return (
    <>
      <FocusModePage
        currentTask={currentTask}
        currentIndex={currentIndex}
        totalTasks={focusTaskOrder.length}
        isProcessing={isProcessing}
        onComplete={handleComplete}
        onSkip={handleSkip}
        onReturnToTop={handleReturnToTop}
        onExitFocusMode={handleExitFocusMode}
        onEnterFocusMode={handleEnterFocusMode}
        inFocusMode={inFocusMode}
        currentView={currentView}
      />
      
      <FocusExitConfirmDialog
        open={showExitConfirm}
        onOpenChange={setShowExitConfirm}
        onConfirm={handleConfirmExit}
      />
    </>
  );
}
