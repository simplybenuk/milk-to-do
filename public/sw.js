
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
  event.waitUntil(self.clients.claim());
  
  // Check for any scheduled notifications from localStorage
  self.clients.matchAll().then(clients => {
    if (clients.length > 0) {
      clients[0].postMessage({
        type: 'GET_NOTIFICATION_SCHEDULE'
      });
    }
  });
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
    sendTestNotification();
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
  self.registration.showNotification('Milk: Test Notification', {
    body: 'This is a test notification. If you can see this, notifications are working!',
    icon: '/milk_logo192.png',
    badge: '/milk_logo192.png',
    tag: 'test-notification',
    data: {
      url: self.location.origin
    }
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
    
    // Schedule the notification
    scheduledNotificationTimer = setTimeout(() => {
      sendDailyReminder();
      // Schedule the next day's notification
      scheduleNextNotification();
    }, timeUntilNotification);
  };
  
  // Start the scheduling process
  scheduleNextNotification();
}

// Function to send the daily reminder notification
function sendDailyReminder() {
  console.log('[Service Worker] Sending daily reminder notification');
  self.registration.showNotification('Milk: Daily Task Reminder', {
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
