
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
import { AlertTriangle, ShieldAlert, UserCheck } from 'lucide-react';

interface UserMakeAdminModalProps {
  user: { id: string; email: string };
  isAdmin: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleAdmin: (userId: string, makeAdmin: boolean) => Promise<void>;
}

export const UserMakeAdminModal: React.FC<UserMakeAdminModalProps> = ({
  user,
  isAdmin,
  open,
  onOpenChange,
  onToggleAdmin
}) => {
  const handleConfirm = async () => {
    await onToggleAdmin(user.id, !isAdmin);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isAdmin ? (
              <ShieldAlert className="h-5 w-5 text-red-500" />
            ) : (
              <UserCheck className="h-5 w-5 text-emerald-500" />
            )}
            {isAdmin ? 'Remove Admin Access' : 'Grant Admin Access'}
          </DialogTitle>
          <DialogDescription>
            {isAdmin 
              ? `Remove admin privileges from ${user.email}`
              : `Grant admin privileges to ${user.email}`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isAdmin ? (
            <div className="flex items-center p-3 bg-amber-50 text-amber-800 rounded-md">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">
                This user will no longer have administrator access and won't be able to access the admin dashboard or manage other users.
              </p>
            </div>
          ) : (
            <div className="flex items-center p-3 bg-blue-50 text-blue-800 rounded-md">
              <ShieldAlert className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">
                This will grant the user full administrator access, including the ability to manage subscriptions and admin access for all users.
              </p>
            </div>
          )}
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
            type="button"
            variant={isAdmin ? "destructive" : "default"}
            onClick={handleConfirm}
          >
            {isAdmin ? 'Remove Admin Access' : 'Grant Admin Access'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
