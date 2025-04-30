
import React, { useEffect, useState } from 'react';
import { FocusModePage } from './FocusModePage';
import { FocusExitConfirmDialog } from '@/components/FocusExitConfirmDialog';
import { useTaskNavigation } from '@/hooks/useTaskNavigation';
import { useFocusModeHandlers } from '@/hooks/useFocusModeHandlers';
import { AppView } from '@/hooks/useAppView';
import { MainContent } from '@/components/MainContent';

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
    isProcessing,
    setSelectedTagIds
  } = useTaskNavigation(inFocusMode, handleFocusEnd);
  
  const handleTagSelection = (tags?: string[]) => {
    setSelectedTagIdsState(tags);
    setSelectedTagIds(tags);
  };

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
