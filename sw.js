const CACHE_NAME = 'scoutpluse-v1.0.1';
const urlsToCache = [
  './',
  './index.html',
  './Logo.png',
  './manifest.json',
  
  // CSS Files
  './CSS/main.css',
  './CSS/components.css',
  './CSS/responsive.css',
  './CSS/auth.css',
  './CSS/events.css',
  './CSS/information.css',
  './CSS/profile.css',
  
  // Core JavaScript Files
  './JS/data/config.js',
  './JS/utils/helpers.js',
  './JS/core/app.js',
  './JS/core/navigation.js',
  
  // Services
  './JS/services/auth.js',
  './JS/services/data-manager.js',
  './JS/services/local-storage.js',
  './JS/services/auto-sync.js',
  './JS/services/theme.js',
  './JS/services/translations.js',
  
  // Pages
  './JS/pages/dashboard.js',
  './JS/pages/events.js',
  './JS/pages/information.js',
  './JS/pages/profile.js',
  
  // Components
  './JS/components/status-indicator.js',
  
  // Data Files
  './JSON/events.json',
  './JSON/users.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('🔄 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ All resources cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Cache installation failed:', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          console.log('📦 Serving from cache:', event.request.url);
          return response;
        }

        // Otherwise fetch from network
        console.log('🌐 Fetching from network:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the new response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('💾 Cached new resource:', event.request.url);
              });

            return response;
          })
          .catch(error => {
            console.error('❌ Network fetch failed:', error);
            
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            
            return new Response('Network error', { status: 503 });
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('✅ Service Worker activated successfully');
      return self.clients.claim();
    })
  );
});

// Handle background sync
self.addEventListener('sync', event => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform background sync operations
      console.log('🔄 Performing background sync...')
    );
  }
});

// Local storage only - no notifications

console.log('🔄 Service Worker loaded successfully'); 