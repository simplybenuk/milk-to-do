
import { AlertCircle } from 'lucide-react';

interface NotificationPermissionInfoProps {
  isSupported: boolean;
  permission: NotificationPermission | 'default';
}

export function NotificationPermissionInfo({ isSupported, permission }: NotificationPermissionInfoProps) {
  if (!isSupported) {
    return (
      <p className="text-sm text-muted-foreground">
        Notifications are not supported in this browser.
      </p>
    );
  }
  
  if (permission === 'denied') {
    return (
      <p className="text-sm text-red-500">
        Notification permission denied. Please enable notifications in your browser settings.
      </p>
    );
  }
  
  return null;
}
