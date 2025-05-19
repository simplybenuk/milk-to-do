
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
import { useEffect, useRef } from "react";

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
  // Track previous open state to avoid unnecessary effects
  const prevOpenRef = useRef(open);
  const confirmedRef = useRef(false);
  
  // Only log when dialog state changes to avoid excessive renders
  useEffect(() => {
    if (prevOpenRef.current !== open) {
      console.log("FocusExitConfirmDialog - Dialog state:", open);
      prevOpenRef.current = open;
      
      // Reset confirmed state when dialog opens/closes
      if (!open) {
        confirmedRef.current = false;
      }
    }
  }, [open]);

  // Handle the confirm action - ensuring pointer events are reset
  const handleConfirm = () => {
    // Prevent multiple clicks
    if (confirmedRef.current) return;
    confirmedRef.current = true;
    
    console.log("FocusExitConfirmDialog - Confirming exit");
    // Reset pointer events immediately
    document.body.style.pointerEvents = "";
    
    // Execute the confirmation callback
    onConfirm();
  };

  // Handle cancel action - ensuring pointer events are reset
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
