
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

// Send a reminder notification to the user about expiring tasks
export const sendTaskReminder = () => {
  return sendNotification('Milk: Task Reminder', {
    body: 'You have tasks that need your attention.',
    icon: '/milk_logo192.png',
    badge: '/milk_logo192.png',
  });
};
