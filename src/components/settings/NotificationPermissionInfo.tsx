
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
      <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
        <p className="font-semibold">Notification permission denied</p>
        <p className="mt-1">You'll need to enable notifications in your browser settings:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Chrome: Site settings &gt; Notifications</li>
          <li>Firefox: Site permissions &gt; Notifications</li>
          <li>Safari: Preferences &gt; Websites &gt; Notifications</li>
          <li>Mobile: Check system notification settings for your browser</li>
        </ul>
      </div>
    );
  }
  
  return null;
}
