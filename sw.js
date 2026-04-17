/**
 * LaborPro Service Worker
 * Cache-first for static assets, network-first for HTML pages.
 *
 * ⚠️ 每次 deploy 前必須 bump CACHE_NAME 尾綴（YYYYMMDDHHmm），
 *    否則 client 會繼續用舊版快取；未來 P2 改成 build-time 自動注入
 */
const CACHE_NAME = 'laborpro-v202604161800';
const STATIC_ASSETS = [
  '/css/common.css',
  '/js/calc-utils.js',
  '/js/fmt.js',
  '/js/animations.js',
  '/js/persona.js',
  '/js/case-law-data.js',
  '/js/case-law-render.js',
  '/js/date-utils.js',
  '/js/ga.js',
  '/favicon.svg',
  '/choulegal-icon.svg',
  '/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // HTML pages: network-first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
