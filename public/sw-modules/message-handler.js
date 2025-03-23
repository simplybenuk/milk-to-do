
/**
 * Message Handler Module
 * Processes messages sent from the client application to the service worker
 */

/**
 * Handles message events from the client
 */
export function handleMessage(event) {
  console.log('[Message Handler] Received message:', event.data);
  
  // Handle message types here if needed
  console.log('[Message Handler] Unhandled message type:', event.data?.type);
}
