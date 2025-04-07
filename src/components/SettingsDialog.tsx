
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, UserCog } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { isPro } = useSubscription();
  
  const handleManageSubscription = () => {
    window.open('https://billing.stripe.com/p/login/9AQ4jydBN3Br3gAcMM', '_blank');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your app preferences
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Subscription</h4>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Current plan: {isPro ? 'Pro' : 'Free'}
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleManageSubscription}
              >
                <span>Manage</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Opens an external site powered by Stripe
            </p>
          </div>
          
          {/* Settings content will go here */}
          <p className="text-sm text-muted-foreground">
            More settings options coming soon.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
