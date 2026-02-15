const CACHE_NAME = 'aquatech-v1';
const ASSETS = [
  'index.html',
  'login.html',
  'profile.html',
  'service.html',
  'store.html',
  'offer.html',
  'manifest.json',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
];

// இன்ஸ்டால் செய்யும்போது ஃபைல்களை சேமித்தல்
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// நெட் இல்லாத போது சேமித்த ஃபைல்களைக் காட்டுதல்
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
