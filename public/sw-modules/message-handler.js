
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
  if (data.type === 'SCHEDULE_NOTIFICATION') {
    console.log('[Message Handler] Scheduling notification:', data.payload);
    if (data.payload && typeof data.payload.hour === 'number' && typeof data.payload.minute === 'number') {
      scheduleNotification(data.payload.hour, data.payload.minute);
      return true;
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
      scheduleNotification(hour, minute);
      return true;
    }
  } else if (data.type === 'TRIGGER_TEST_NOTIFICATION') {
    console.log('[Message Handler] Received request to send test notification');
    sendTestNotification();
    return true;
  } else if (data.type === 'SEND_NOTIFICATION') {
    if (data.payload) {
      const { title, options } = data.payload;
      console.log('[Message Handler] Showing notification:', title, options);
      showNotification(title, options || {});
      return true;
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
  if (handleNotificationMessages(event.data)) {
    return;
  }
  
  // Handle other message types here if needed
  console.log('[Message Handler] Unhandled message type:', event.data.type);
}
