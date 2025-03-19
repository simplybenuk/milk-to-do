
import { useState } from 'react';

export type AppView = 'main' | 'all' | 'closed' | 'stats';

export function useAppView(initialView: AppView = 'main') {
  const [currentView, setCurrentView] = useState<AppView>(initialView);
  
  return {
    currentView,
    setCurrentView
  };
}
