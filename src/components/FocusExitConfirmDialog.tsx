
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
    console.log("FocusExitConfirmDialog - Resetting pointer events, dialog state:", open);
    
    return () => {
      // Also reset on unmount
      document.body.style.pointerEvents = "";
      console.log("FocusExitConfirmDialog - Cleanup pointer events");
    };
  }, [open]);

  // Handle the confirm action
  const handleConfirm = () => {
    // Reset pointer events immediately
    document.body.style.pointerEvents = "";
    console.log("FocusExitConfirmDialog - Confirming exit, resetting pointer events");
    
    // Run the confirm callback first
    onConfirm();
    
    // Then close the dialog (this should happen after onConfirm)
    onOpenChange(false);
  };

  // Handle cancel action explicitly
  const handleCancel = () => {
    // Reset pointer events immediately
    document.body.style.pointerEvents = "";
    console.log("FocusExitConfirmDialog - Cancelling exit, resetting pointer events");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="z-50">
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
