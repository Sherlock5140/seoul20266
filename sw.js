const CACHE_NAME = 'travel-guide-v28';
const APP_SHELL = [
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './icon.svg',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './scripts/config.js?v=20260402k',
  './scripts/utils.js?v=20260402k',
  './scripts/app.js?v=20260403i',
  './services/storage.js?v=20260402k',
  './services/rates.js?v=20260402k',
  './services/map.js?v=20260402k',
  './data/seoul-2026.js?v=20260403j'
];

const APP_SHELL_PATHS = new Set(APP_SHELL.map((path) => new URL(path, self.location.origin + self.location.pathname).pathname));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
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
      caches.match('./index.html').then((cachedIndex) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put('./index.html', responseClone))
                .catch((err) => console.warn('[SW] index.html cache write failed', err));
            }
            return response;
          })
          .catch(() => cachedIndex || caches.match('./offline.html').then((r) => r || new Response('Service Unavailable', { status: 503, statusText: 'Service Unavailable' })));

        return cachedIndex || networkFetch;
      })
    );
    return;
  }

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (!APP_SHELL_PATHS.has(requestUrl.pathname)) {
    return;
  }

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
