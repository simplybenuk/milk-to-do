
const CACHE_NAME = 'milk-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/milk_logo192.png',
  '/milk_logo512.png',
];

let scheduledNotificationTimer = null;

self.addEventListener('install', (event) => {
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
});

self.addEventListener('activate', (event) => {
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
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Handle message events from the client
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Received message:', event.data);
  
  if (event.data.type === 'SCHEDULE_NOTIFICATION') {
    console.log('[Service Worker] Scheduling notification:', event.data.payload);
    scheduleNotification(event.data.payload.hour, event.data.payload.minute);
  } else if (event.data.type === 'CANCEL_NOTIFICATIONS') {
    cancelScheduledNotifications();
  } else if (event.data.type === 'NOTIFICATION_SCHEDULE_RESPONSE' && event.data.payload) {
    const { hour, minute } = event.data.payload;
    if (hour !== undefined && minute !== undefined) {
      console.log(`[Service Worker] Restoring notification schedule: ${hour}:${minute}`);
      scheduleNotification(hour, minute);
    }
  } else if (event.data.type === 'TRIGGER_TEST_NOTIFICATION') {
    // Immediately show a test notification
    console.log('[Service Worker] Received request to send test notification');
    sendTestNotification();
  } else if (event.data.type === 'SEND_NOTIFICATION') {
    if (event.data.payload) {
      const { title, options } = event.data.payload;
      console.log('[Service Worker] Showing notification:', title, options);
      self.registration.showNotification(title, options).then(() => {
        console.log('[Service Worker] Notification shown successfully');
      }).catch(error => {
        console.error('[Service Worker] Error showing notification:', error);
      });
    }
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
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
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
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
});

// Function to send a test notification
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

// Function to schedule a daily notification
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

// Function to send the daily reminder notification
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

// Function to cancel scheduled notifications
function cancelScheduledNotifications() {
  if (scheduledNotificationTimer) {
    clearTimeout(scheduledNotificationTimer);
    scheduledNotificationTimer = null;
    console.log('[Service Worker] Scheduled notifications cancelled');
  }
}
