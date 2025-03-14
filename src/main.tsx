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
    
    // Check if notifications are enabled
    if (localStorage.getItem('notificationsEnabled') === 'true') {
      // Check if we need to schedule a notification
      const notificationDetails = getScheduledNotificationDetails();
      
      if (notificationDetails) {
        console.log(`Attempting to restore scheduled notification for ${notificationDetails.hour}:${notificationDetails.minute}`);
        
        // Use a small delay to ensure the service worker is fully activated
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
    }
  },
  onRegisterError(error) {
    console.error('Service worker registration failed:', error);
  }
});

// Create a listener for messages from the service worker
if ('serviceWorker' in navigator) {
  console.log('Setting up service worker message listener');
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
  
  // Make sure service worker is running
  navigator.serviceWorker.ready.then(registration => {
    console.log('Service worker is ready:', registration);
  }).catch(err => {
    console.error('Error with service worker ready state:', err);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
