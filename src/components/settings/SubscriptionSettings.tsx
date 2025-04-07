
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { Label } from '@/components/ui/label';

export function SubscriptionSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { isPro, isLoading: isSubscriptionLoading } = useSubscription();

  const handleManageSubscription = () => {
    setIsLoading(true);
    // Open Stripe billing portal in a new tab
    window.open('https://billing.stripe.com/p/login/9AQ4jydBN3Br3gAcMM', '_blank');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Subscription Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription plan and billing details
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Current Plan</Label>
            <p className="text-sm text-muted-foreground">
              {isSubscriptionLoading 
                ? 'Loading...' 
                : isPro 
                  ? 'Pro Plan' 
                  : 'Free Plan'}
            </p>
          </div>
          <Button 
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <span>Manage Subscription</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2 italic">
          You will be redirected to an external site powered by Stripe.
        </div>
      </div>
    </div>
  );
}
