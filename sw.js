/* 
===========================================
SCOUTPLUSE - SERVICE WORKER
===========================================

Service Worker للتطبيق مع دعم:
1. التخزين المؤقت للملفات الثابتة
2. العمل بدون اتصال
3. تحديث البيانات في الخلفية
4. إشعارات الدفع
*/

const CACHE_NAME = 'scoutpluse-v1.0.0';
const STATIC_CACHE = 'scoutpluse-static-v1.0.0';
const DYNAMIC_CACHE = 'scoutpluse-dynamic-v1.0.0';

// الملفات الأساسية للتخزين المؤقت
const STATIC_FILES = [
  '/',
  '/HTML/index.html',
  '/CSS/main.css',
  '/CSS/components.css',
  '/CSS/responsive.css',
  '/CSS/auth.css',
  '/CSS/events.css',
  '/CSS/information.css',
  '/CSS/profile.css',
  '/JS/core/app.js',
  '/JS/core/navigation.js',
  '/JS/services/auth.js',
  '/JS/services/local-storage.js',
  '/JS/services/data-manager.js',
  '/JS/services/auto-sync.js',
  '/JS/services/theme.js',
  '/JS/services/translations.js',
  '/JS/pages/dashboard.js',
  '/JS/pages/events.js',
  '/JS/pages/information.js',
  '/JS/pages/profile.js',
  '/JS/data/config.js',
  '/JS/utils/helpers.js',
  '/JSON/events.json',
  '/JSON/users.json',
  '/manifest.json'
];

// الملفات الخارجية (الصور من Pexels)
const EXTERNAL_RESOURCES = [
  'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg',
  'https://images.pexels.com/photos/2885320/pexels-photo-2885320.jpeg',
  'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg',
  'https://images.pexels.com/photos/163403/box-sport-men-training-163403.jpeg'
];

// ===========================================
// تثبيت Service Worker
// ===========================================

self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // تخزين الملفات الثابتة
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📦 Service Worker: Caching static files...');
        return cache.addAll(STATIC_FILES);
      }),
      
      // تخزين الموارد الخارجية
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('🖼️ Service Worker: Caching external resources...');
        return cache.addAll(EXTERNAL_RESOURCES);
      })
    ]).then(() => {
      console.log('✅ Service Worker: Installation complete');
      // فرض التفعيل الفوري
      return self.skipWaiting();
    }).catch(error => {
      console.error('❌ Service Worker: Installation failed', error);
    })
  );
});

// ===========================================
// تفعيل Service Worker
// ===========================================

self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    // تنظيف التخزين المؤقت القديم
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation complete');
      // السيطرة على جميع العملاء فوراً
      return self.clients.claim();
    })
  );
});

// ===========================================
// اعتراض الطلبات
// ===========================================

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // تجاهل الطلبات غير HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // استراتيجية مختلفة للملفات المختلفة
  if (isStaticFile(request.url)) {
    // Cache First للملفات الثابتة
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request.url)) {
    // Network First لطلبات API
    event.respondWith(networkFirst(request));
  } else if (isImageRequest(request.url)) {
    // Cache First للصور
    event.respondWith(cacheFirst(request));
  } else {
    // Stale While Revalidate للباقي
    event.respondWith(staleWhileRevalidate(request));
  }
});

// ===========================================
// استراتيجيات التخزين المؤقت
// ===========================================

/**
 * Cache First Strategy
 * يبحث في التخزين المؤقت أولاً، ثم الشبكة
 */
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 Cache hit:', request.url);
      return cachedResponse;
    }
    
    console.log('🌐 Cache miss, fetching:', request.url);
    const networkResponse = await fetch(request);
    
    // تخزين الاستجابة الجديدة
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Cache First failed:', error);
    return getOfflineFallback(request);
  }
}

/**
 * Network First Strategy
 * يحاول الشبكة أولاً، ثم التخزين المؤقت
 */
async function networkFirst(request) {
  try {
    console.log('🌐 Network first:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📦 Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return getOfflineFallback(request);
  }
}

/**
 * Stale While Revalidate Strategy
 * يعيد من التخزين المؤقت ويحدث في الخلفية
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // تحديث في الخلفية
  const networkResponsePromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(error => {
    console.log('🌐 Background update failed:', error);
  });
  
  // إرجاع المخزن مؤقتاً أو انتظار الشبكة
  return cachedResponse || networkResponsePromise;
}

// ===========================================
// دوال مساعدة
// ===========================================

/**
 * تحديد نوع الملف
 */
function isStaticFile(url) {
  return STATIC_FILES.some(file => url.includes(file)) ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.html');
}

function isAPIRequest(url) {
  return url.includes('/api/') ||
         url.includes('.json') ||
         url.includes('.php');
}

function isImageRequest(url) {
  return url.includes('.jpg') ||
         url.includes('.jpeg') ||
         url.includes('.png') ||
         url.includes('.gif') ||
         url.includes('.webp') ||
         url.includes('pexels.com');
}

/**
 * صفحة بديلة للوضع بدون اتصال
 */
function getOfflineFallback(request) {
  if (request.destination === 'document') {
    return caches.match('/HTML/index.html');
  }
  
  if (request.destination === 'image') {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#6b7280">صورة غير متاحة</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  return new Response('المحتوى غير متاح بدون اتصال', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

// ===========================================
// مزامنة الخلفية
// ===========================================

self.addEventListener('sync', event => {
  console.log('🔄 Background Sync:', event.tag);
  
  if (event.tag === 'sync-events') {
    event.waitUntil(syncEvents());
  }
});

/**
 * مزامنة الأحداث في الخلفية
 */
async function syncEvents() {
  try {
    console.log('🔄 Syncing events in background...');
    
    // محاولة تحديث الأحداث
    const response = await fetch('/JSON/events.json');
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put('/JSON/events.json', response.clone());
      console.log('✅ Events synced successfully');
      
      // إشعار العملاء بالتحديث
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'EVENTS_UPDATED',
          data: 'تم تحديث الأحداث في الخلفية'
        });
      });
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// ===========================================
// إشعارات الدفع
// ===========================================

self.addEventListener('push', event => {
  console.log('📬 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'إشعار جديد من ScoutPluse',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/HTML/index.html'
    },
    actions: [
      {
        action: 'open',
        title: 'فتح التطبيق',
        icon: '/icons/action-open.png'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/icons/action-close.png'
      }
    ],
    requireInteraction: true,
    silent: false
  };
  
  event.waitUntil(
    self.registration.showNotification('ScoutPluse', options)
  );
});

// التعامل مع النقر على الإشعارات
self.addEventListener('notificationclick', event => {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/HTML/index.html')
    );
  }
});

// ===========================================
// رسائل من العميل
// ===========================================

self.addEventListener('message', event => {
  console.log('💬 Message from client:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// ===========================================
// معالجة الأخطاء
// ===========================================

self.addEventListener('error', event => {
  console.error('❌ Service Worker Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('❌ Service Worker Unhandled Rejection:', event.reason);
  event.preventDefault();
});

console.log('🎉 Service Worker loaded successfully');