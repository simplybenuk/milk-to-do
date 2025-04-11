
import { AppView } from '@/hooks/useAppView';
import { AllTasksList } from '@/components/all-tasks';
import { ClosedTasksList } from '@/components/ClosedTasksList';
import { MainContent } from '@/components/MainContent';
import { TaskStats } from '@/components/TaskStats';

interface ViewContentProps {
  currentView: AppView;
  inFocusMode: boolean;
}

export function ViewContent({ currentView, inFocusMode }: ViewContentProps) {
  // Return the appropriate component based on the current view
  return (
    <>
      {currentView === 'main' && <MainContent inFocusMode={inFocusMode} />}
      {currentView === 'all' && <AllTasksList />}
      {currentView === 'closed' && <ClosedTasksList />}
      {currentView === 'stats' && <TaskStats />}
    </>
  );
}
