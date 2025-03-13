
// Check if the browser supports notifications
export const isNotificationSupported = () => {
  return 'Notification' in window;
};

// Check if notifications are enabled by the user
export const areNotificationsEnabled = () => {
  return localStorage.getItem('notificationsEnabled') === 'true';
};

// Check if notification permission is granted
export const hasNotificationPermission = () => {
  return isNotificationSupported() && Notification.permission === 'granted';
};

// Send a notification to the user
export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (!isNotificationSupported()) return false;
  if (!areNotificationsEnabled()) return false;
  if (!hasNotificationPermission()) return false;

  try {
    const notification = new Notification(title, options);
    
    // Handle notification click
    notification.onclick = function() {
      window.focus();
      notification.close();
    };
    
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};

// Send a reminder notification to the user about tasks
export const sendTaskReminder = () => {
  return sendNotification('Milk: Daily Task Reminder', {
    body: 'Time to check your tasks for today!',
    icon: '/milk_logo192.png',
    badge: '/milk_logo192.png',
  });
};

// Schedule a daily notification at a specific time
export const scheduleDailyNotification = (hour: number, minute: number) => {
  if (!areNotificationsEnabled()) return false;
  
  const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  localStorage.setItem('scheduledNotificationTime', timeString);
  
  // Register with service worker if available
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      payload: { hour, minute }
    });
  }
  
  return true;
};

// Cancel scheduled notifications
export const cancelScheduledNotifications = () => {
  localStorage.removeItem('scheduledNotificationTime');
  
  // Notify service worker if available
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CANCEL_NOTIFICATIONS'
    });
  }
  
  return true;
};

// Get the currently scheduled notification time (if any)
export const getScheduledNotificationTime = (): string | null => {
  return localStorage.getItem('scheduledNotificationTime');
};
