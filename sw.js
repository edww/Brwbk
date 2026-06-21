// Service worker volontairement neutre en V4 : pas de cache, suppression des anciens caches.
self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request, {cache: 'no-store'}).catch(() => fetch(event.request)));
});
