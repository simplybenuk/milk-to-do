
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface TestNotificationButtonProps {
  onTest: () => void;
  isSending: boolean;
  disabled: boolean;
}

export function TestNotificationButton({ 
  onTest, 
  isSending, 
  disabled 
}: TestNotificationButtonProps) {
  return (
    <div className="pt-2">
      <Button 
        onClick={onTest}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        disabled={isSending || disabled}
      >
        <AlertCircle className="h-4 w-4" />
        {isSending ? 'Sending...' : 'Send Test Notification'}
      </Button>
      <p className="text-xs text-muted-foreground mt-2">
        This will send a real notification to your device. If you don't see it, check your device's notification settings.
      </p>
    </div>
  );
}
