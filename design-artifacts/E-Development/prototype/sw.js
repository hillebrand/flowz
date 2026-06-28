// Flowz Service Worker — offline-first caching

const CACHE_NAME = 'flowz-v22';

const PRECACHE = [
  '/',
  'index.html',
  '00.1-login.html',
  '00.2-registreren.html',
  '00.3-wachtwoord-vergeten.html',
  '00.4-wachtwoord-resetten.html',
  '01.1-welkomst.html',
  '01.2-magister-sync.html',
  '01.3-import-review.html',
  '01.4-taak-aanmaken.html',
  '01.5-takenoverzicht.html',
  '02.1-energie-check-in.html',
  '02.2-shortlist-vandaag.html',
  '03.1-taak-detail.html',
  '03.3-sessie-voorbereiding.html',
  '03.4-actieve-sessie.html',
  '03.5-sessie-afgerond.html',
  '03.6-pauzetimer.html',
  '04.1-instellingen.html',
  '04.2-beschikbaarheid.html',
  '05.1-afgeronde-taken.html',
  'shared/app.js',
  'shared/nav.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      const toDelete = keys.filter(k => k !== CACHE_NAME);
      return Promise.all(toDelete.map(k => caches.delete(k)));
    })
  );
  self.clients.claim();
});

// Cache-first for all same-origin requests
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
