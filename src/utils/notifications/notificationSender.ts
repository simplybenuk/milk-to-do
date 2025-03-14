
// Extend the standard NotificationOptions type to include mobile-specific properties
interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  timestamp?: number;
  renotify?: boolean;
}

// Send a notification to the user
export const sendNotification = (title: string, options?: ExtendedNotificationOptions) => {
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
          options: {
            ...options,
            // Ensure these fields are set for better compatibility
            silent: options?.silent ?? false,
            requireInteraction: options?.requireInteraction ?? true,
            // @ts-ignore - timestamp is valid for notifications but not in TypeScript types
            timestamp: Date.now()
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
      // @ts-ignore - timestamp is valid for notifications but not in TypeScript types
      timestamp: Date.now()
    });
    
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
    // @ts-ignore - vibrate is valid for notifications but not in TypeScript types
    vibrate: [200, 100, 200], // Add vibration pattern for mobile
    renotify: true, // Replace existing notification with same tag
  });
};

// Trigger a test notification immediately for debugging purposes
export const triggerTestNotification = () => {
  console.log('Attempting to trigger a test notification');
  
  // Check permissions first
  if (!hasNotificationPermission()) {
    console.error('Cannot send test notification: Permission not granted');
    return false;
  }
  
  if (!areNotificationsEnabled()) {
    console.error('Cannot send test notification: Notifications not enabled in app settings');
    return false;
  }
  
  try {
    // Try direct notification first for immediate feedback
    console.log('Creating a direct notification for testing');
    const notification = new Notification('Milk: Test Notification', {
      body: 'This is a test notification. If you can see this, notifications are working!',
      icon: '/milk_logo192.png',
      badge: '/milk_logo192.png',
      tag: 'test-notification',
      // @ts-ignore - vibrate is valid for notifications but not in TypeScript types
      vibrate: [200, 100, 200], // Add vibration pattern for mobile
      requireInteraction: true, // Make notification stay until interaction
      renotify: true, // Replace existing notification with same tag
      // @ts-ignore - timestamp is valid for notifications but not in TypeScript types
      timestamp: Date.now()
    });
    
    notification.onclick = function() {
      window.focus();
      notification.close();
    };
    
    console.log('Test notification sent successfully via direct API');
    
    // Also try through service worker for completeness
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      console.log('Also triggering test notification through service worker');
      navigator.serviceWorker.controller.postMessage({
        type: 'TRIGGER_TEST_NOTIFICATION'
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error sending direct test notification:', error);
    
    // If direct notification failed, try through service worker as fallback
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      console.log('Falling back to service worker for test notification');
      navigator.serviceWorker.controller.postMessage({
        type: 'TRIGGER_TEST_NOTIFICATION'
      });
      return true;
    }
    
    return false;
  }
};

// Import required functions from notification core
import { isNotificationSupported, areNotificationsEnabled, hasNotificationPermission } from './notificationCore';
