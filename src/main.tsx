
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

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
      console.log('Service worker updated - notifications disabled');
      
      // Make sure to clear any existing service worker state
      navigator.serviceWorker.ready.then(registration => {
        // No messaging to service worker for notifications
        console.log('Service worker is ready - no notifications will be shown');
      });
    }).catch(err => {
      console.error('Error updating service worker:', err);
    });
  },
  onRegisterError(error) {
    console.error('Service worker registration failed:', error);
  }
});

createRoot(document.getElementById("root")!).render(<App />);
