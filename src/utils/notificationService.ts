
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
    // Try to send through service worker first if available
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      console.log('Sending notification through service worker');
      navigator.serviceWorker.controller.postMessage({
        type: 'SEND_NOTIFICATION',
        payload: {
          title,
          options
        }
      });
      return true;
    }
    
    // Fallback to the Notification API directly
    console.log('Sending notification directly (no service worker)');
    const notification = new Notification(title, options);
    
    // Handle notification click
    notification.onclick = function() {
      window.focus();
      notification.close();
    };
    
    console.log('Notification sent successfully via direct API');
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};

// Send a reminder notification to the user about tasks
export const sendTaskReminder = () => {
  console.log('Attempting to send task reminder notification');
  return sendNotification('Milk: Daily Task Reminder', {
    body: 'Time to check your tasks for today!',
    icon: '/milk_logo192.png',
    badge: '/milk_logo192.png',
    tag: 'task-reminder',
  });
};

// Trigger a test notification immediately for debugging purposes
export const triggerTestNotification = () => {
  console.log('Attempting to trigger a test notification');
  
  // Try to use service worker first if available
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    console.log('Triggering test notification through service worker');
    navigator.serviceWorker.controller.postMessage({
      type: 'TRIGGER_TEST_NOTIFICATION'
    });
    return true;
  }
  
  // Fallback to direct notification
  return sendNotification('Milk: Test Notification', {
    body: 'This is a test notification. If you can see this, notifications are working!',
    icon: '/milk_logo192.png',
    badge: '/milk_logo192.png',
    tag: 'test-notification',
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
  if ('serviceWorker' in navigator) {
    console.log('Checking for service worker to schedule notification');
    
    const scheduleWithServiceWorker = () => {
      if (navigator.serviceWorker.controller) {
        console.log('Service worker controller found, sending schedule message');
        navigator.serviceWorker.controller.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          payload: { hour, minute }
        });
        return true;
      }
      console.log('No service worker controller available');
      return false;
    };
    
    // Try immediately
    if (scheduleWithServiceWorker()) {
      return true;
    }
    
    // If no controller immediately available, wait for it to activate
    console.log('No active service worker, waiting for one to become active');
    navigator.serviceWorker.ready.then((registration) => {
      console.log('Service worker now ready, attempting to schedule notification');
      if (registration.active) {
        registration.active.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          payload: { hour, minute }
        });
        console.log('Schedule message sent to active service worker');
      }
    });
    
    return true;
  }
  
  console.log('Service worker not supported');
  return false;
};

// Cancel scheduled notifications
export const cancelScheduledNotifications = () => {
  console.log('Cancelling scheduled notifications');
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
  const time = localStorage.getItem('scheduledNotificationTime');
  console.log(`Retrieved scheduled time from localStorage: ${time}`);
  return time;
};

// Get scheduled notification details as hour and minute
export const getScheduledNotificationDetails = () => {
  const timeString = getScheduledNotificationTime();
  if (!timeString) return null;
  
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hour: hours, minute: minutes };
};
