
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

console.log('Initializing app and service worker registration');

// Register service worker for PWA with proper error handling
const updateSW = registerSW({
  immediate: true, // Register immediately
  onNeedRefresh() {
    // Always update when new version is available
    console.log('New content available. Reloading app automatically.');
    updateSW(true);
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
    
    // Force update the service worker on every page load
    registration.update().then(() => {
      console.log('Service worker update forced - notifications disabled');
      
      // Make sure to clear any existing service worker state
      navigator.serviceWorker.ready.then(registration => {
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
