
/**
 * Cache Manager Module
 * Handles all cache-related functionality for the service worker
 */

// Cache Configuration
const CACHE_NAME = 'milk-cache-v2'; // Incremented version number

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
 * Handles the activate event - claims clients and cleans up old caches
 */
export function handleActivate(event) {
  console.log('[Cache Manager] Activating Service Worker ...', event);
  
  // Delete old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Cache Manager] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Cache Manager] Claiming clients');
      return self.clients.claim();
    })
  );
}

/**
 * Handles fetch events - serves from network first, fallback to cache
 */
export function handleFetch(event) {
  // Use network-first strategy for HTML and JS files
  if (event.request.url.includes('index.html') || 
      event.request.url.endsWith('.js') || 
      event.request.url.endsWith('.css')) {
    
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response to cache it
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          // If network fetch fails, try from cache
          return caches.match(event.request);
        })
    );
  } else {
    // For other resources, try cache first
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
}
