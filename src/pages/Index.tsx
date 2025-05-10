
import React, { useCallback } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { TaskHeader } from '@/components/TaskHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { FocusModeContainer } from '@/components/focus/FocusModeContainer';
import { ViewContent } from '@/components/ViewContent';
import { useIndexPage } from '@/hooks/useIndexPage';

const Index = () => {
  // Use our hook for page initialization and state management
  const {
    currentView,
    setCurrentView,
    inFocusMode,
    setInFocusMode,
    showExitConfirm,
    setShowExitConfirm,
    confirmExitFocusMode
  } = useIndexPage();

  // Extract addTask from the store only once
  const addTask = useTaskStore(state => state.addTask);
  
  // Create a memoized handler for adding tasks
  const handleAddTask = useCallback((title: string, priority: "high" | "medium" | "low", expiryDate: Date, tagIds?: string[]) => {
    addTask(title, priority, expiryDate, undefined, tagIds);
  }, [addTask]);

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
        
        {/* ViewContent will only render when not in focus mode */}
        <ViewContent 
          currentView={currentView}
          inFocusMode={inFocusMode}
        />
        
        {/* Only show the AddTaskDialog when not in focus mode */}
        {!inFocusMode && (
          <AddTaskDialog onAddTask={handleAddTask} />
        )}
      </div>
    </PageContainer>
  );
}

export default Index;
