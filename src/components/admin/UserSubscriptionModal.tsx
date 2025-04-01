
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

type UserWithDetails = {
  id: string;
  email: string;
  profile: {
    subscription_status: string;
    subscription_updated_at: string;
  } | null;
};

interface UserSubscriptionModalProps {
  user: UserWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateSubscription: (userId: string, status: 'free' | 'pro') => Promise<void>;
}

export const UserSubscriptionModal: React.FC<UserSubscriptionModalProps> = ({
  user,
  open,
  onOpenChange,
  onUpdateSubscription
}) => {
  const [subscription, setSubscription] = React.useState<'free' | 'pro'>(
    (user.profile?.subscription_status as 'free' | 'pro') || 'free'
  );
  
  const currentPlan = user.profile?.subscription_status || 'free';
  const lastUpdated = user.profile?.subscription_updated_at 
    ? format(new Date(user.profile.subscription_updated_at), 'MMM d, yyyy h:mm a')
    : 'Never';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSubscription(user.id, subscription);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Update Subscription
          </DialogTitle>
          <DialogDescription>
            Change subscription status for {user.email}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Plan</span>
              <span className="font-medium">{currentPlan}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated</span>
              <span>{lastUpdated}</span>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Select New Subscription Plan</h4>
              <RadioGroup 
                defaultValue={currentPlan} 
                onValueChange={(value) => setSubscription(value as 'free' | 'pro')}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free">Free</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pro" id="pro" />
                  <Label htmlFor="pro">Pro</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={subscription === currentPlan}
            >
              Update Subscription
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
