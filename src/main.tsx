
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
import { getScheduledNotificationDetails } from '@/utils/notifications'

console.log('Initializing app and service worker registration');

// Register service worker for PWA with proper error handling
const updateSW = registerSW({
  immediate: true, // Register immediately
  onNeedRefresh() {
    // Prompt user to update when new version is available
    if (confirm('New content available. Reload app?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
  onRegistered(registration) {
    console.log('Service worker registered successfully', registration);
    
    if (!registration) {
      console.error('Service worker registration is null');
      return;
    }
    
    // Force update the service worker to ensure latest version
    registration.update().then(() => {
      console.log('Service worker updated');
    }).catch(err => {
      console.error('Error updating service worker:', err);
    });
    
    // Only restore scheduled notifications if they exist
    // But don't actually send a notification when restoring
    const notificationDetails = getScheduledNotificationDetails();
    
    if (localStorage.getItem('notificationsEnabled') === 'true' && 
        notificationDetails) {
      console.log(`Restoring scheduled notification for ${notificationDetails.hour}:${notificationDetails.minute}`);
      
      // Use a delay to ensure service worker is fully activated
      setTimeout(() => {
        if (registration.active) {
          registration.active.postMessage({
            type: 'SCHEDULE_NOTIFICATION',
            payload: notificationDetails
          });
          console.log(`Restored scheduled notification for ${notificationDetails.hour}:${notificationDetails.minute}`);
        } else {
          console.error('Service worker not active yet, cannot schedule notification');
          
          // Wait for it to become active
          navigator.serviceWorker.ready.then((reg) => {
            console.log('Service worker now ready, attempting to schedule notification');
            reg.active?.postMessage({
              type: 'SCHEDULE_NOTIFICATION',
              payload: notificationDetails
            });
          });
        }
      }, 1000);
    }
  },
  onRegisterError(error) {
    console.error('Service worker registration failed:', error);
  }
});

// Create a listener for messages from the service worker
if ('serviceWorker' in navigator) {
  console.log('Setting up service worker message listener');
  
  // Make sure we're registered for push notifications
  navigator.serviceWorker.ready.then(registration => {
    console.log('Service worker is ready, checking push subscription');
    
    // Check for existing push subscription
    registration.pushManager.getSubscription().then(subscription => {
      if (!subscription && 'Notification' in window && Notification.permission === 'granted') {
        console.log('No push subscription found, attempting to subscribe');
        
        // Try to subscribe for push
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
          )
        }).then(subscription => {
          console.log('Push subscription successful', subscription);
        }).catch(err => {
          console.error('Push subscription failed:', err);
        });
      }
    });
  }).catch(err => {
    console.error('Error with service worker ready state:', err);
  });
  
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('Received message from service worker:', event.data);
    
    // Handle messages from service worker
    if (event.data.type === 'GET_NOTIFICATION_SCHEDULE') {
      const notificationDetails = getScheduledNotificationDetails();
      if (notificationDetails) {
        console.log('Sending notification schedule to service worker', notificationDetails);
        event.source?.postMessage({
          type: 'NOTIFICATION_SCHEDULE_RESPONSE',
          payload: notificationDetails
        });
      } else {
        console.log('No notification schedule to send to service worker');
      }
    }
  });
}

// Helper function to convert base64 to Uint8Array for VAPID keys
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

createRoot(document.getElementById("root")!).render(<App />);
