
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register service worker for PWA with proper error handling
const updateSW = registerSW({
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
    
    // Check if we need to schedule a notification
    const scheduledTime = localStorage.getItem('scheduledNotificationTime');
    if (scheduledTime && localStorage.getItem('notificationsEnabled') === 'true' && registration) {
      const [hours, minutes] = scheduledTime.split(':').map(Number);
      registration.active?.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        payload: { hour: hours, minute: minutes }
      });
      console.log(`Restored scheduled notification for ${scheduledTime}`);
    }
  },
  onRegisterError(error) {
    console.error('Service worker registration failed:', error);
  }
});

createRoot(document.getElementById("root")!).render(<App />);
