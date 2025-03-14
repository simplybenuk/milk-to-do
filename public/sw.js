
/**
 * Milk App Service Worker
 * This service worker handles caching, offline support, and push notifications
 * for the Milk task management application.
 */

/**
 * Cache Configuration
 */
const CACHE_NAME = 'milk-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/milk_logo192.png',
  '/milk_logo512.png',
];

/**
 * Shared state
 */
let scheduledNotificationTimer = null;

/**
 * ===================================================
 * CACHE MANAGEMENT FUNCTIONS
 * ===================================================
 */

/**
 * Handles the install event - caches static assets
 */
function handleInstall(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
  // Ensure the service worker activates right away
  self.skipWaiting();
}

/**
 * Handles the activate event - claims clients and sets up notifications
 */
function handleActivate(event) {
  console.log('[Service Worker] Activating Service Worker ...', event);
  // Claim clients right away so the page is controlled by the service worker
  event.waitUntil(
    self.clients.claim().then(() => {
      console.log('[Service Worker] Claimed all clients');
      
      // Check for any scheduled notifications from localStorage
      return self.clients.matchAll().then(clients => {
        if (clients.length > 0) {
          console.log('[Service Worker] Requesting notification schedule from client');
          clients[0].postMessage({
            type: 'GET_NOTIFICATION_SCHEDULE'
          });
        } else {
          console.log('[Service Worker] No clients to request schedule from');
        }
      });
    })
  );
}

/**
 * Handles fetch events - serves from cache when available
 */
function handleFetch(event) {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
}

/**
 * ===================================================
 * NOTIFICATION FUNCTIONS
 * ===================================================
 */

/**
 * Sends a test notification to verify notification functionality
 */
function sendTestNotification() {
  console.log('[Service Worker] Sending test notification');
  
  return self.registration.showNotification('Milk: Test Notification', {
    body: 'This is a test notification from the service worker. If you can see this, notifications are working!',
    icon: '/milk_logo192.png',
    badge: '/milk_logo192.png',
    tag: 'test-notification',
    data: {
      url: self.location.origin
    },
    requireInteraction: true  // This makes the notification stick around until user interacts with it
  }).then(() => {
    console.log('[Service Worker] Test notification sent successfully');
    return true;
  }).catch(error => {
    console.error('[Service Worker] Error sending test notification:', error);
    return false;
  });
}

/**
 * Schedules a daily notification at the specified time
 */
function scheduleNotification(hour, minute) {
  // Clear any existing scheduled notification timer
  cancelScheduledNotifications();
  
  console.log(`[Service Worker] Scheduling daily notification for ${hour}:${minute}`);
  
  // Calculate the next notification time
  const scheduleNextNotification = () => {
    const now = new Date();
    const scheduledTime = new Date();
    
    scheduledTime.setHours(hour, minute, 0, 0);
    
    // If the scheduled time has already passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    
    console.log(`[Service Worker] Next notification scheduled for ${scheduledTime.toLocaleString()}`);
    console.log(`[Service Worker] Time until notification: ${Math.floor(timeUntilNotification / 60000)} minutes`);
    
    // For debugging - send a notification in 10 seconds if time is far away
    if (timeUntilNotification > 60000) {
      console.log('[Service Worker] Sending a test notification in 10 seconds');
      setTimeout(() => {
        sendDailyReminder('[Test] In 10 seconds');
      }, 10000);
    }
    
    // Schedule the notification
    scheduledNotificationTimer = setTimeout(() => {
      console.log('[Service Worker] Scheduled time reached, sending notification');
      sendDailyReminder();
      // Schedule the next day's notification
      scheduleNextNotification();
    }, timeUntilNotification);
  };
  
  // Start the scheduling process
  scheduleNextNotification();
}

/**
 * Sends the daily reminder notification
 */
function sendDailyReminder(debugInfo = '') {
  console.log('[Service Worker] Sending daily reminder notification');
  self.registration.showNotification(`Milk: Daily Task Reminder ${debugInfo}`.trim(), {
    body: 'Time to check your tasks for today!',
    icon: '/milk_logo192.png',
    badge: '/milk_logo192.png',
    tag: 'daily-reminder',
    data: {
      url: self.location.origin
    }
  });
}

/**
 * Cancels any scheduled notifications
 */
function cancelScheduledNotifications() {
  if (scheduledNotificationTimer) {
    clearTimeout(scheduledNotificationTimer);
    scheduledNotificationTimer = null;
    console.log('[Service Worker] Scheduled notifications cancelled');
  }
}

/**
 * ===================================================
 * EVENT HANDLERS
 * ===================================================
 */

/**
 * Handles notification click events - focuses or opens the app
 */
function handleNotificationClick(event) {
  console.log('[Service Worker] Notification clicked:', event);
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
}

/**
 * Handles push notification events
 */
function handlePush(event) {
  console.log('[Service Worker] Push notification received:', event);
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Milk: Task Reminder';
  const options = {
    body: data.body || 'You have tasks that need your attention.',
    icon: '/milk_logo192.png',
    badge: '/milk_logo192.png',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
}

/**
 * Processes notification-related messages
 */
function handleNotificationMessages(data) {
  if (data.type === 'SCHEDULE_NOTIFICATION') {
    console.log('[Service Worker] Scheduling notification:', data.payload);
    scheduleNotification(data.payload.hour, data.payload.minute);
    return true;
  } else if (data.type === 'CANCEL_NOTIFICATIONS') {
    cancelScheduledNotifications();
    return true;
  } else if (data.type === 'NOTIFICATION_SCHEDULE_RESPONSE' && data.payload) {
    const { hour, minute } = data.payload;
    if (hour !== undefined && minute !== undefined) {
      console.log(`[Service Worker] Restoring notification schedule: ${hour}:${minute}`);
      scheduleNotification(hour, minute);
      return true;
    }
  } else if (data.type === 'TRIGGER_TEST_NOTIFICATION') {
    console.log('[Service Worker] Received request to send test notification');
    sendTestNotification();
    return true;
  } else if (data.type === 'SEND_NOTIFICATION') {
    if (data.payload) {
      const { title, options } = data.payload;
      console.log('[Service Worker] Showing notification:', title, options);
      self.registration.showNotification(title, options).then(() => {
        console.log('[Service Worker] Notification shown successfully');
      }).catch(error => {
        console.error('[Service Worker] Error showing notification:', error);
      });
      return true;
    }
  }
  return false;
}

/**
 * Handles message events from the client
 */
function handleMessage(event) {
  console.log('[Service Worker] Received message:', event.data);
  
  // Try to handle notification-related messages first
  if (handleNotificationMessages(event.data)) {
    return;
  }
  
  // Handle other message types here if needed
  console.log('[Service Worker] Unhandled message type:', event.data.type);
}

/**
 * ===================================================
 * EVENT REGISTRATION
 * ===================================================
 */

// Register event listeners
self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('fetch', handleFetch);
self.addEventListener('message', handleMessage);
self.addEventListener('notificationclick', handleNotificationClick);
self.addEventListener('push', handlePush);

// Log service worker initialization
console.log('[Service Worker] Service worker initialized and event listeners registered');
