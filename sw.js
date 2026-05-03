const CACHE_NAME = 'travel-guide-v46-20260503-1604';
const CDN_CACHE  = 'cdn-assets-v2';

const APP_SHELL = [
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest?v=20260403l',
  './icon.svg',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './scripts/config.js?v=20260402k',
  './scripts/utils.js?v=20260402k',
  './scripts/app.js?v=20260503f',
  './services/storage.js?v=20260503c',
  './services/rates.js?v=20260404b',
  './services/map.js?v=20260402k',
  './data/trip-catalog.js?v=20260503d',
  './data/seoul-2026.js?v=20260503f',
  './data/hongkong-2026.js?v=20260503d'
];

// Versioned CDN URLs — safe to pre-cache at install time
const CDN_RESOURCES = [
  'https://unpkg.com/vue@3.3.4/dist/vue.global.prod.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
];

// CDN hosts: versioned (cache-first) vs unversioned (stale-while-revalidate)
const CDN_HOSTS_VERSIONED = ['unpkg.com', 'cdnjs.cloudflare.com'];
const CDN_HOSTS_REVALIDATE = ['cdn.tailwindcss.com']; // unversioned URL → always revalidate

const APP_SHELL_PATHS = new Set(APP_SHELL.map((path) => new URL(path, self.location.origin + self.location.pathname).pathname));

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // App shell — must succeed
      caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
      // CDN resources — fail silently per resource
      caches.open(CDN_CACHE).then((cache) =>
        Promise.all(
          CDN_RESOURCES.map((url) =>
            cache.add(url).catch((err) => console.warn('[SW] CDN pre-cache failed:', url, err))
          )
        )
      )
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== CDN_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      Promise.race([
        fetch(request),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000))
      ])
        .then((response) => {
          if (response && response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put('./index.html', responseClone))
              .catch((err) => console.warn('[SW] index.html cache write failed', err));
          }
          return response;
        })
        .catch(() => (
          caches.match('./index.html')
            .then((cachedIndex) => cachedIndex || caches.match('./offline.html'))
            .then((fallback) => fallback || new Response('Service Unavailable', { status: 503, statusText: 'Service Unavailable' }))
        ))
    );
    return;
  }

  // Versioned CDN (unpkg, cdnjs): cache-first, fetch on miss
  if (CDN_HOSTS_VERSIONED.includes(requestUrl.hostname)) {
    event.respondWith(
      caches.open(CDN_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response && response.ok) {
              cache.put(request, response.clone())
                .catch((err) => console.warn('[SW] CDN cache write failed', err));
            }
            return response;
          });
        })
      )
    );
    return;
  }

  // Unversioned CDN (Tailwind): stale-while-revalidate — serve cache instantly, update in background
  if (CDN_HOSTS_REVALIDATE.includes(requestUrl.hostname)) {
    event.respondWith(
      caches.open(CDN_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const networkFetch = fetch(request).then((response) => {
            if (response && response.ok) {
              cache.put(request, response.clone())
                .catch((err) => console.warn('[SW] Tailwind cache update failed', err));
            }
            return response;
          }).catch(() => cached);
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  if (requestUrl.origin !== self.location.origin) return;
  if (!APP_SHELL_PATHS.has(requestUrl.pathname)) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (!response || !response.ok) return cachedResponse || response;
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(request, responseClone))
            .catch((err) => console.warn('[SW] shell asset cache write failed', err));
          return response;
        })
        .catch(() => {
          if (cachedResponse) return cachedResponse;
          return new Response('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
        });
      return cachedResponse || networkFetch;
    })
  );
});
