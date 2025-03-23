
/**
 * Message Handler Module
 * Processes messages sent from the client application to the service worker
 */

/**
 * Handles message events from the client
 */
export function handleMessage(event) {
  console.log('[Message Handler] Received message:', event.data);
  
  // Log message types but don't process any notification-related actions
  console.log('[Message Handler] Unhandled message type:', event.data?.type);
  
  // We intentionally ignore all messages that might trigger notifications
}
