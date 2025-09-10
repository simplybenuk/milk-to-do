
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
import { ThemeProvider } from 'next-themes'

console.log('Initializing app and service worker registration');

// Register service worker for PWA
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available. Updating app...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
  onRegistered(registration) {
    console.log('Service worker registered successfully', registration);
  },
  onRegisterError(error) {
    console.error('Service worker registration failed:', error);
  }
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <App />
  </ThemeProvider>
);
