const CACHE = 'farmmap-v1';
const ASSETS = [
  '/surveyor',
  '/config.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Cache map tiles for offline use
  if (e.request.url.includes('/tiles/') || e.request.url.includes('tile.openstreetmap') ||
      e.request.url.includes('mapbox.com') || e.request.url.includes('google.com/vt')) {
    e.respondWith(
      caches.open(CACHE + '-tiles').then(async cache => {
        const cached = await cache.match(e.request);
        if (cached) return cached;
        try {
          const res = await fetch(e.request);
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        } catch { return cached || new Response('', { status: 503 }); }
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).catch(() => new Response('Offline', { status: 503 }))
    )
  );
});
