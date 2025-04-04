
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Sparkles } from 'lucide-react';

interface UpgradeToProDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
}

export function UpgradeToProDialog({ open, onOpenChange, featureName }: UpgradeToProDialogProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate('/upgrade');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Pro Feature
          </DialogTitle>
          <DialogDescription>
            <p className="mt-2">
              The <strong>{featureName}</strong> feature is only available to Pro members.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 p-4 border border-emerald-100">
            <h3 className="font-semibold text-emerald-700 mb-2">Pro Plan Benefits:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                </div>
                <span>Edit tasks and change priorities</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                </div>
                <span>Split tasks into smaller steps</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                </div>
                <span>Advanced analytics and insights</span>
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:w-auto w-full">
            Not Now
          </Button>
          <Button onClick={handleUpgrade} className="sm:w-auto w-full bg-emerald-600 hover:bg-emerald-700">
            <CreditCard className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
