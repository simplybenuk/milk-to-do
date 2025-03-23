
/**
 * Cache Manager Module
 * Handles all cache-related functionality for the service worker
 */

// Cache Configuration
const CACHE_NAME = 'milk-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/milk_logo192.png',
  '/milk_logo512.png',
];

/**
 * Handles the install event - caches static assets
 */
export function handleInstall(event) {
  console.log('[Cache Manager] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Cache Manager] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Cache Manager] Skip waiting on install');
        return self.skipWaiting();
      })
  );
}

/**
 * Handles the activate event - claims clients and sets up notifications
 */
export function handleActivate(event) {
  console.log('[Cache Manager] Activating Service Worker ...', event);
  // Claim clients right away so the page is controlled by the service worker
  event.waitUntil(
    self.clients.claim().then(() => {
      console.log('[Cache Manager] Claimed all clients');
      // We won't automatically request notification schedule here anymore
      // This prevents unwanted notifications when opening the app
    })
  );
}

/**
 * Handles fetch events - serves from cache when available
 */
export function handleFetch(event) {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
}
