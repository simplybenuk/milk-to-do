
// Core notification functionality and permission handling

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
  if (!isNotificationSupported()) {
    console.log('Notifications not supported in this browser');
    return false;
  }
  
  try {
    console.log('Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log(`Permission result: ${permission}`);
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};
