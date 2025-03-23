/**
 * Notification Manager Module
 * Handles all notification-related functionality for the service worker
 */

// Shared state for notification scheduling
let scheduledNotificationTimer = null;

/**
 * Sends a test notification to verify notification functionality
 */
export function sendTestNotification() {
  console.log('[Notification Manager] Sending test notification');
  
  return self.registration.showNotification('Milk: Test Notification', {
    body: 'This is a test notification from the service worker. If you can see this, notifications are working!',
    icon: '/milk_logo192.png',
    badge: '/milk_logo192.png',
    tag: 'test-notification',
    data: {
      url: self.location.origin
    },
    requireInteraction: true,
    vibrate: [200, 100, 200],
    renotify: true,
    timestamp: Date.now()
  }).then(() => {
    console.log('[Notification Manager] Test notification sent successfully');
    return true;
  }).catch(error => {
    console.error('[Notification Manager] Error sending test notification:', error);
    return false;
  });
}

/**
 * Schedules a daily notification at the specified time
 */
export function scheduleNotification(hour, minute) {
  // Clear any existing scheduled notification timer
  cancelScheduledNotifications();
  
  console.log(`[Notification Manager] Scheduling daily notification for ${hour}:${minute}`);
  
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
    
    console.log(`[Notification Manager] Next notification scheduled for ${scheduledTime.toLocaleString()}`);
    console.log(`[Notification Manager] Time until notification: ${Math.floor(timeUntilNotification / 60000)} minutes`);
    
    // Schedule the notification
    scheduledNotificationTimer = setTimeout(() => {
      console.log('[Notification Manager] Scheduled time reached, sending notification');
      sendDailyReminder();
      // Schedule the next day's notification
      scheduleNextNotification();
    }, timeUntilNotification);
  };
  
  // Start the scheduling process
  scheduleNextNotification();
  
  return true;
}

/**
 * Sends the daily reminder notification
 */
export function sendDailyReminder(debugPrefix = '') {
  console.log('[Notification Manager] Sending daily reminder notification');
  return self.registration.showNotification(`${debugPrefix || ''}Milk: Daily Task Reminder`, {
    body: 'Time to check your tasks for today!',
    icon: '/milk_logo192.png',
    badge: '/milk_logo192.png',
    tag: 'daily-reminder',
    data: {
      url: self.location.origin
    },
    vibrate: [200, 100, 200],  // Add vibration pattern for mobile
    requireInteraction: true,  // Make notification stay until interaction
    renotify: true,            // Replace existing notification with same tag
    timestamp: Date.now()      // Add timestamp for better ordering
  }).then(() => {
    console.log('[Notification Manager] Daily reminder notification sent successfully');
    return true;
  }).catch(error => {
    console.error('[Notification Manager] Error sending daily reminder notification:', error);
    return false;
  });
}

/**
 * Cancels any scheduled notifications
 */
export function cancelScheduledNotifications() {
  if (scheduledNotificationTimer) {
    clearTimeout(scheduledNotificationTimer);
    scheduledNotificationTimer = null;
    console.log('[Notification Manager] Scheduled notifications cancelled');
  }
}

/**
 * Regular notifications directly from message events
 */
export function showNotification(title, options) {
  console.log('[Notification Manager] Showing notification:', title, options);
  
  return self.registration.showNotification(title, {
    ...options,
    requireInteraction: options.requireInteraction ?? true,
    vibrate: options.vibrate || [200, 100, 200],
    timestamp: options.timestamp || Date.now(),
    renotify: options.renotify ?? true
  }).then(() => {
    console.log(`[Notification Manager] Notification "${title}" sent successfully`);
    return true;
  }).catch(error => {
    console.error(`[Notification Manager] Error sending notification "${title}":`, error);
    return false;
  });
}

/**
 * Handles notification click events - focuses or opens the app
 */
export function handleNotificationClick(event) {
  console.log('[Notification Manager] Notification clicked:', event);
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if ('focus' in client) {
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
export function handlePush(event) {
  console.log('[Notification Manager] Push notification received:', event);
  
  let title = 'Milk: Task Reminder';
  let options = {
    body: 'You have tasks that need your attention.',
    icon: '/milk_logo192.png',
    badge: '/milk_logo192.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    renotify: true,
    timestamp: Date.now()
  };
  
  if (event.data) {
    try {
      const data = event.data.json();
      title = data.title || title;
      options = { ...options, ...data.options };
    } catch (e) {
      console.error('[Notification Manager] Error parsing push data:', e);
    }
  }

  event.waitUntil(self.registration.showNotification(title, options));
}
