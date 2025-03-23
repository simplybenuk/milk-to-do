
/**
 * Message Handler Module
 * Processes messages sent from the client application to the service worker
 */

import { 
  sendTestNotification, 
  scheduleNotification, 
  cancelScheduledNotifications,
  showNotification
} from './notification-manager.js';

/**
 * Processes notification-related messages
 */
export function handleNotificationMessages(data) {
  console.log('[Message Handler] Processing notification message:', data.type);
  
  if (data.type === 'SCHEDULE_NOTIFICATION') {
    console.log('[Message Handler] Scheduling notification:', data.payload);
    if (data.payload && typeof data.payload.hour === 'number' && typeof data.payload.minute === 'number') {
      return scheduleNotification(data.payload.hour, data.payload.minute);
    } else {
      console.error('[Message Handler] Invalid scheduling data:', data.payload);
      return false;
    }
  } else if (data.type === 'CANCEL_NOTIFICATIONS') {
    cancelScheduledNotifications();
    return true;
  } else if (data.type === 'NOTIFICATION_SCHEDULE_RESPONSE' && data.payload) {
    const { hour, minute } = data.payload;
    if (hour !== undefined && minute !== undefined) {
      console.log(`[Message Handler] Restoring notification schedule: ${hour}:${minute}`);
      return scheduleNotification(hour, minute);
    }
  } else if (data.type === 'TRIGGER_TEST_NOTIFICATION') {
    console.log('[Message Handler] Received request to send test notification');
    return sendTestNotification();
  } else if (data.type === 'SEND_NOTIFICATION') {
    if (data.payload) {
      const { title, options } = data.payload;
      
      // Add timestamp here in service worker context where TypeScript won't complain
      if (options && !options.timestamp) {
        options.timestamp = Date.now();
      }
      
      console.log('[Message Handler] Showing notification:', title, options);
      return showNotification(title, options || {});
    }
  }
  return false;
}

/**
 * Handles message events from the client
 */
export function handleMessage(event) {
  console.log('[Message Handler] Received message:', event.data);
  
  // Try to handle notification-related messages first
  if (event.data && handleNotificationMessages(event.data)) {
    return;
  }
  
  // Handle other message types here if needed
  console.log('[Message Handler] Unhandled message type:', event.data?.type);
}
