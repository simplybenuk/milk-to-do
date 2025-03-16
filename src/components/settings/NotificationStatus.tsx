
interface NotificationStatusProps {
  isSupported: boolean;
  notificationsEnabled: boolean;
  notificationPermission: NotificationPermission | 'default';
}

export function NotificationStatus({ 
  isSupported, 
  notificationsEnabled, 
  notificationPermission 
}: NotificationStatusProps) {
  const getNotificationStatus = () => {
    if (!isSupported) {
      return "Not supported in this browser";
    }
    if (notificationPermission === 'denied') {
      return "Blocked in browser settings";
    }
    if (notificationPermission !== 'granted') {
      return "Permission not granted";
    }
    if (!notificationsEnabled) {
      return "Disabled in app settings";
    }
    return "Enabled";
  };

  return (
    <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
      <p>Status: <span className={notificationsEnabled && notificationPermission === 'granted' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
        {getNotificationStatus()}
      </span></p>
    </div>
  );
}
