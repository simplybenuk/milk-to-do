
import { AppView } from '@/hooks/useAppView';
import { AllTasksList } from '@/components/all-tasks';
import { ClosedTasksList } from '@/components/ClosedTasksList';
import { MainContent } from '@/components/MainContent';
import { TaskStats } from '@/components/TaskStats';
import { useTaskNavigation } from '@/hooks/useTaskNavigation';
import { useFocusModeHandlers } from '@/hooks/useFocusModeHandlers';

interface ViewContentProps {
  currentView: AppView;
  inFocusMode: boolean;
}

export function ViewContent({ currentView, inFocusMode }: ViewContentProps) {
  // If not in focus mode, render the appropriate view directly
  if (!inFocusMode) {
    return (
      <>
        {currentView === 'main' && (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-milk-500 text-center mb-4">Switch to Focus Mode to see your prioritized tasks.</p>
          </div>
        )}
        {currentView === 'all' && <AllTasksList />}
        {currentView === 'closed' && <ClosedTasksList />}
        {currentView === 'stats' && <TaskStats />}
      </>
    );
  }
  
  // In focus mode, we need to provide all the props
  // Initialize focus mode handlers and navigation
  const handleFocusEnd = () => {
    // This is a stub - the actual implementation is in FocusModeContainer
    console.log("Focus mode ended from ViewContent - stub implementation");
  };
  
  const {
    currentTask,
    currentIndex,
    focusTaskOrder,
    handleComplete,
    handleSkip,
    handleReturnToTop
  } = useTaskNavigation(inFocusMode, handleFocusEnd);

  // For focus mode exit handler
  const handleExitFocusMode = () => {
    // This is a stub - the actual implementation is in FocusModeContainer
    console.log("Exit focus mode from ViewContent - stub implementation");
  };
  
  return (
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
    />
  );
}
