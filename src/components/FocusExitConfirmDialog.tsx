
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
    document.body.style.pointerEvents = "";
    console.log("FocusExitConfirmDialog - Reset pointer events, dialog state:", open);
    
    return () => {
      document.body.style.pointerEvents = "";
      console.log("FocusExitConfirmDialog - Cleanup pointer events");
    };
  }, [open]);

  // Handle the confirm action
  const handleConfirm = () => {
    console.log("FocusExitConfirmDialog - Confirming exit");
    // Reset pointer events immediately
    document.body.style.pointerEvents = "";
    
    // First process the confirmation
    onConfirm();
    
    // Close the dialog after confirmation is processed
    setTimeout(() => {
      onOpenChange(false);
    }, 10);
  };

  // Handle cancel action
  const handleCancel = () => {
    console.log("FocusExitConfirmDialog - Cancelling exit");
    document.body.style.pointerEvents = "";
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
