
import React from 'react';
import { AllTasksList } from '@/components/AllTasksList';
import { ClosedTasksList } from '@/components/ClosedTasksList';
import { TaskStats } from '@/components/TaskStats';
import { AppView } from '@/hooks/useAppView';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ViewContentProps {
  currentView: AppView;
  inFocusMode: boolean;
}

export function ViewContent({ currentView, inFocusMode }: ViewContentProps) {
  const { isPro } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if user has access to statistics
  React.useEffect(() => {
    if (currentView === 'stats' && !isPro) {
      toast({
        title: "Pro subscription required",
        description: "Statistics are only available to Pro subscribers.",
        variant: "destructive"
      });
      navigate('/upgrade');
    }
  }, [currentView, isPro, toast, navigate]);
  
  // If in focus mode and on the main view, don't render any content
  if (inFocusMode && currentView === 'main') {
    return null;
  }
  
  switch (currentView) {
    case 'all':
      return (
        <>
          <h2 className="text-2xl font-bold text-milk-900 mb-6">All Tasks</h2>
          <AllTasksList />
        </>
      );
    case 'closed':
      return (
        <>
          <h2 className="text-2xl font-bold text-milk-900 mb-6">Closed Tasks</h2>
          <ClosedTasksList />
        </>
      );
    case 'stats':
      // Only render stats if user is Pro
      return isPro ? <TaskStats /> : null;
    default:
      return null;
  }
}
