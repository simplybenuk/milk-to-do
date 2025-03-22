
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect } from "react";

interface FocusExitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function FocusExitConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: FocusExitConfirmDialogProps) {
  // Ensure pointer events are reset whenever the dialog state changes
  useEffect(() => {
    // Reset pointer events when dialog opens or closes
    document.body.style.pointerEvents = "";
    
    return () => {
      // Also reset on unmount
      document.body.style.pointerEvents = "";
    };
  }, [open]);

  // Handle the confirm action
  const handleConfirm = () => {
    // Reset pointer events immediately
    document.body.style.pointerEvents = "";
    
    // First run the confirm callback
    onConfirm();
    
    // Then close the dialog (this should happen after onConfirm)
    onOpenChange(false);
  };

  // Handle cancel action explicitly
  const handleCancel = () => {
    // Reset pointer events immediately
    document.body.style.pointerEvents = "";
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Exit Focus Mode?</AlertDialogTitle>
          <AlertDialogDescription>
            This will end your current focus session. All tasks will be reprioritized for your next session.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Exit Focus Mode
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
