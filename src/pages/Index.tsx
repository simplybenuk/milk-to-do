
import React from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { TaskHeader } from '@/components/TaskHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { FocusModeContainer } from '@/components/focus/FocusModeContainer';
import { ViewContent } from '@/components/ViewContent';
import { useIndexPage } from '@/hooks/useIndexPage';

const Index = () => {
  // Use our new hook for page initialization and state management
  const {
    currentView,
    setCurrentView,
    inFocusMode,
    setInFocusMode,
    showExitConfirm,
    setShowExitConfirm,
    confirmExitFocusMode
  } = useIndexPage();

  return (
    <PageContainer inFocusMode={inFocusMode}>
      <div className="w-full">
        <TaskHeader
          currentView={currentView}
          onViewChange={setCurrentView}
          inFocusMode={inFocusMode}
        />

        {/* Focus mode container handles all focus mode related components and logic */}
        <FocusModeContainer
          currentView={currentView}
          setCurrentView={setCurrentView}
          inFocusMode={inFocusMode}
          setInFocusMode={setInFocusMode}
          showExitConfirm={showExitConfirm}
          setShowExitConfirm={setShowExitConfirm}
          confirmExitFocusMode={confirmExitFocusMode}
        />
        
        {/* Render content based on current view */}
        <ViewContent 
          currentView={currentView}
          inFocusMode={inFocusMode}
        />
        
        {/* Only show the AddTaskDialog when not in focus mode */}
        {!inFocusMode && (
          <AddTaskDialog onAddTask={(title, priority, expiryDate, tagIds) => {
            const { addTask } = useTaskStore.getState();
            addTask(title, priority, expiryDate, undefined, tagIds);
          }} />
        )}
      </div>
    </PageContainer>
  );
}

export default Index;
