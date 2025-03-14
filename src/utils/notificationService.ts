
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

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) return false;
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Send a notification to the user
export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (!isNotificationSupported()) {
    console.log('Notifications not supported');
    return false;
  }
  
  if (!areNotificationsEnabled()) {
    console.log('Notifications not enabled by user');
    return false;
  }
  
  if (!hasNotificationPermission()) {
    console.log('Notification permission not granted');
    return false;
  }

  try {
    // Try to send through service worker first
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'TRIGGER_TEST_NOTIFICATION'
      });
      console.log('Requested service worker to send notification');
      return true;
    }
    // Fallback to the Notification API
    const notification = new Notification(title, options);
    
    // Handle notification click
    notification.onclick = function() {
      window.focus();
      notification.close();
    };
    
    console.log('Notification sent successfully');
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
  if (!areNotificationsEnabled()) {
    console.log('Cannot schedule notification: notifications not enabled');
    return false;
  }
  
  const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  console.log(`Scheduling daily notification for ${timeString}`);
  localStorage.setItem('scheduledNotificationTime', timeString);
  
  // Register with service worker if available
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      payload: { hour, minute }
    });
    console.log('Sent schedule message to service worker');
    return true;
  }
  
  console.log('Service worker not available for scheduling');
  return false;
};

// Cancel scheduled notifications
export const cancelScheduledNotifications = () => {
  localStorage.removeItem('scheduledNotificationTime');
  
  // Notify service worker if available
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CANCEL_NOTIFICATIONS'
    });
    console.log('Sent cancellation message to service worker');
  }
  
  return true;
};

// Get the currently scheduled notification time (if any)
export const getScheduledNotificationTime = (): string | null => {
  return localStorage.getItem('scheduledNotificationTime');
};

// Get scheduled notification details as hour and minute
export const getScheduledNotificationDetails = () => {
  const timeString = getScheduledNotificationTime();
  if (!timeString) return null;
  
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hour: hours, minute: minutes };
};
