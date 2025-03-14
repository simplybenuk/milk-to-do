
import { isNotificationSupported, areNotificationsEnabled, hasNotificationPermission } from './notificationCore';

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
  
  // Force notification regardless of the service worker 
  // This is specifically for testing purposes
  if (isNotificationSupported() && hasNotificationPermission()) {
    try {
      console.log('Creating a direct notification for testing');
      const notification = new Notification('Milk: Test Notification', {
        body: 'This is a test notification. If you can see this, notifications are working!',
        icon: '/milk_logo192.png',
        badge: '/milk_logo192.png',
        tag: 'test-notification',
      });
      
      notification.onclick = function() {
        window.focus();
        notification.close();
      };
      
      console.log('Test notification sent successfully via direct API');
      return true;
    } catch (error) {
      console.error('Error sending direct test notification:', error);
    }
  }
  
  // If direct notification failed or not possible, try through service worker
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    console.log('Triggering test notification through service worker');
    navigator.serviceWorker.controller.postMessage({
      type: 'TRIGGER_TEST_NOTIFICATION'
    });
    return true;
  }
  
  console.log('Unable to send test notification - no supported methods available');
  return false;
};
