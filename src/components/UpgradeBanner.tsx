
import React from 'react';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';

export function UpgradeBanner() {
  const navigate = useNavigate();
  const { isPro, isLoading } = useSubscription();
  
  // Don't show the banner for Pro users or while loading subscription status
  if (isPro || isLoading) {
    return null;
  }
  
  return (
    <div className="w-full bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-violet-100 p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <p className="text-sm text-violet-700">
            You're using <span className="font-semibold">SourList Free</span>
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => navigate('/upgrade')}
          variant="outline"
          className="bg-card border-violet-200 hover:bg-violet-50 text-violet-700 text-xs"
        >
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}
