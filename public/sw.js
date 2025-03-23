
/**
 * Milk App Service Worker
 * This service worker handles caching, offline support, and push notifications
 * for the Milk task management application.
 * 
 * The code has been refactored into modules for better maintainability:
 * - cache-manager.js: Handles caching and offline support
 * - notification-manager.js: Handles all notification functionality
 * - message-handler.js: Processes messages from the client
 */

// Import our modules - Since service workers can use module imports in modern browsers
import { handleInstall, handleActivate, handleFetch } from './sw-modules/cache-manager.js';
import { handleNotificationClick, handlePush } from './sw-modules/notification-manager.js';
import { handleMessage } from './sw-modules/message-handler.js';

/**
 * ===================================================
 * EVENT REGISTRATION
 * ===================================================
 */

// Register event listeners
self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('fetch', handleFetch);
self.addEventListener('message', handleMessage);
self.addEventListener('notificationclick', handleNotificationClick);
self.addEventListener('push', handlePush);

// Log service worker initialization
console.log('[Service Worker] Service worker initialized and event listeners registered');
