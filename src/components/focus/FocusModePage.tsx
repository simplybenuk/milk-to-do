
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Focus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { FocusTagSelector } from './FocusTagSelector';
import { useSubscription } from '@/hooks/useSubscription';
import useTagStore from '@/stores/useTagStore';

interface FocusModePageProps {
  currentTask: any;
  currentIndex: number;
  totalTasks: number;
  isProcessing: boolean;
  onComplete: (taskId: string) => void;
  onSkip: () => void;
  onReturnToTop: () => void;
  onExitFocusMode: () => void;
  onEnterFocusMode: (selectedTags?: string[]) => void;
  inFocusMode: boolean;
  currentView: 'main' | 'all' | 'closed' | 'stats';
}

export function FocusModePage({
  onEnterFocusMode,
  inFocusMode,
  currentView
}: FocusModePageProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const { isPro } = useSubscription();
  const { tags } = useTagStore();
  
  const hasMultipleTags = tags.length > 1;
  
  const handleEnterFocusMode = () => {
    if (isPro && hasMultipleTags) {
      setShowTagSelector(true);
    } else {
      onEnterFocusMode();
    }
  };
  
  const handleStartFocus = () => {
    onEnterFocusMode(selectedTags);
    setShowTagSelector(false);
  };
  
  const handleCancel = () => {
    setShowTagSelector(false);
    setSelectedTags([]);
  };
  
  // Only show the focus mode button on the All Tasks view when not in focus mode
  if (!inFocusMode && currentView === 'all') {
    if (showTagSelector && isPro && hasMultipleTags) {
      return (
        <Card className="mb-6 p-4 mx-auto max-w-md">
          <h3 className="font-medium mb-4">Filter by tags for your focus session</h3>
          <FocusTagSelector 
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            className="mb-6"
          />
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStartFocus}
              className="bg-milk-600 hover:bg-milk-700 text-white"
            >
              <Focus className="mr-2 h-4 w-4" />
              Start Focus
            </Button>
          </div>
        </Card>
      );
    }
    
    return (
      <div className="mb-6 flex justify-center">
        <Button 
          onClick={handleEnterFocusMode}
          className="bg-milk-600 hover:bg-milk-700 text-white animate-fade-in"
        >
          <Focus className="mr-2 h-4 w-4" />
          Enter Focus Mode
        </Button>
      </div>
    );
  }
  
  // For all other scenarios, don't render anything
  // This allows other components to control the content
  return null;
}
