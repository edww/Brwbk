const CACHE = 'brewbook-v1';
const ASSETS = ['./','./index.html','./style.css','./app.js','./manifest.webmanifest'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch', event => event.respondWith(caches.match(event.request).then(r=>r || fetch(event.request))));
