// Schedule notification functionality

// Schedule a daily notification at a specific time
export const scheduleDailyNotification = (hour: number, minute: number) => {
  if (localStorage.getItem('notificationsEnabled') !== 'true') {
    console.log('Cannot schedule notification: notifications not enabled');
    return false;
  }
  
  const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  console.log(`Scheduling daily notification for ${timeString}`);
  localStorage.setItem('scheduledNotificationTime', timeString);
  
  // Register with service worker if available
  if ('serviceWorker' in navigator) {
    console.log('Checking for service worker to schedule notification');
    
    const scheduleWithServiceWorker = () => {
      if (navigator.serviceWorker.controller) {
        console.log('Service worker controller found, sending schedule message');
        navigator.serviceWorker.controller.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          payload: { hour, minute }
        });
        return true;
      }
      console.log('No service worker controller available');
      return false;
    };
    
    // Try immediately
    if (scheduleWithServiceWorker()) {
      return true;
    }
    
    // If no controller immediately available, wait for it to activate
    console.log('No active service worker, waiting for one to become active');
    navigator.serviceWorker.ready.then((registration) => {
      console.log('Service worker now ready, attempting to schedule notification');
      if (registration.active) {
        registration.active.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          payload: { hour, minute }
        });
        console.log('Schedule message sent to active service worker');
      }
    });
    
    return true;
  }
  
  console.log('Service worker not supported');
  return false;
};

// Cancel scheduled notifications
export const cancelScheduledNotifications = () => {
  console.log('Cancelling scheduled notifications');
  localStorage.removeItem('scheduledNotificationTime');
  
  // Notify service worker if available
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CANCEL_NOTIFICATIONS'
    });
    console.log('Sent cancellation message to service worker');
  }
  
  return true;
};

// Get the currently scheduled notification time (if any)
export const getScheduledNotificationTime = (): string | null => {
  const time = localStorage.getItem('scheduledNotificationTime');
  console.log(`Retrieved scheduled time from localStorage: ${time}`);
  return time;
};

// Get scheduled notification details as hour and minute
export const getScheduledNotificationDetails = () => {
  const timeString = getScheduledNotificationTime();
  if (!timeString) return null;
  
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hour: hours, minute: minutes };
};
