
// Extend the standard NotificationOptions type to include mobile-specific properties
interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  timestamp?: number;
  renotify?: boolean;
}

// Send a notification to the user
export const sendNotification = (title: string, options?: ExtendedNotificationOptions) => {
  if (!isNotificationSupported()) {
    console.error('Notifications not supported in this browser');
    return false;
  }
  
  if (!areNotificationsEnabled()) {
    console.error('Notifications not enabled by user in app settings');
    return false;
  }
  
  if (!hasNotificationPermission()) {
    console.error('Notification permission not granted by user');
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
          options: {
            ...options,
            // Ensure these fields are set for better compatibility
            silent: options?.silent ?? false,
            requireInteraction: options?.requireInteraction ?? true,
            // Remove timestamp from here as it's not in standard NotificationOptions
            // We'll add it back in the service worker where it won't cause TypeScript errors
          }
        }
      });
      return true;
    }
    
    // Fallback to the Notification API directly
    console.log('Sending notification directly (no service worker)');
    const notification = new Notification(title, {
      ...options,
      silent: options?.silent ?? false,
      requireInteraction: options?.requireInteraction ?? true,
      // Remove timestamp from direct call as well
    } as NotificationOptions);
    
    // Handle notification click
    notification.onclick = function() {
      console.log('Notification clicked, focusing window');
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
    vibrate: [200, 100, 200], // Add vibration pattern for mobile
    renotify: true, // Replace existing notification with same tag
  });
};

// Trigger a test notification immediately for debugging purposes
export const triggerTestNotification = () => {
  console.log('Attempting to trigger a test notification');
  
  // Check permissions and settings first
  if (!hasNotificationPermission()) {
    console.error('Cannot send test notification: Permission not granted');
    return false;
  }
  
  if (!areNotificationsEnabled()) {
    console.error('Cannot send test notification: Notifications not enabled in app settings');
    return false;
  }
  
  // First check for service worker - use it if available for consistent behavior
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      console.log('Sending test notification through service worker');
      navigator.serviceWorker.controller.postMessage({
        type: 'TRIGGER_TEST_NOTIFICATION'
      });
      console.log('Test notification request sent to service worker');
      return true;
    } catch (swError) {
      console.error('Error sending test notification via service worker:', swError);
      // Fall through to direct notification attempt
    }
  } else {
    console.log('No service worker controller available for test notification');
  }
  
  // Try direct notification as a fallback
  try {
    console.log('Creating a direct notification for testing');
    const notification = new Notification('Milk: Test Notification', {
      body: 'This is a test notification sent directly. If you can see this, notifications are working!',
      icon: '/milk_logo192.png',
      badge: '/milk_logo192.png',
      tag: 'test-notification-direct',
      // TypeScript doesn't like vibrate on standard NotificationOptions, so cast it
      requireInteraction: true,
      renotify: true,
    } as ExtendedNotificationOptions);
    
    notification.onclick = function() {
      console.log('Direct notification clicked, focusing window');
      window.focus();
      notification.close();
    };
    
    console.log('Test notification sent successfully via direct API');
    return true;
  } catch (error) {
    console.error('Error sending direct test notification:', error);
    return false;
  }
};

// Import required functions from notification core
import { isNotificationSupported, areNotificationsEnabled, hasNotificationPermission } from './notificationCore';

