
import { useCallback, useState, useEffect } from 'react';
import { 
  isNotificationSupported,
  areNotificationsEnabled,
  hasNotificationPermission,
  requestNotificationPermission,
  sendNotification,
  sendTaskReminder,
  triggerTestNotification
} from '@/utils/notifications';

export function useNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'default'>('default');
  const [isSending, setIsSending] = useState(false);

  // Initialize state on mount
  useEffect(() => {
    const supported = isNotificationSupported();
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
      setIsEnabled(areNotificationsEnabled());
    }
  }, []);

  // Request permission
  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;
    
    const granted = await requestNotificationPermission();
    setPermission(granted ? 'granted' : 'denied');
    return granted;
  }, [isSupported]);

  // Enable notifications
  const enableNotifications = useCallback(async () => {
    if (!isSupported) return false;
    
    // Request permission if not already granted
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }
    
    localStorage.setItem('notificationsEnabled', 'true');
    setIsEnabled(true);
    return true;
  }, [isSupported, permission, requestPermission]);

  // Disable notifications
  const disableNotifications = useCallback(() => {
    localStorage.setItem('notificationsEnabled', 'false');
    setIsEnabled(false);
    return true;
  }, []);

  // Send a test notification
  const sendTest = useCallback(() => {
    if (!isSupported || !isEnabled || permission !== 'granted') {
      console.error('Cannot send test: notifications not enabled or permitted');
      return false;
    }
    
    setIsSending(true);
    
    setTimeout(() => {
      const result = triggerTestNotification();
      console.log('Test notification result:', result);
      setIsSending(false);
    }, 500);
    
    return true;
  }, [isSupported, isEnabled, permission]);

  return {
    isSupported,
    isEnabled,
    permission,
    isSending,
    hasPermission: permission === 'granted',
    canSend: isSupported && isEnabled && permission === 'granted',
    requestPermission,
    enableNotifications,
    disableNotifications,
    sendTest,
    sendNotification,
    sendTaskReminder
  };
}
