const CACHE_NAME = 'aquatech-v2'; // Version update
const ASSETS = [
  '/',
  'index.html',
  'login.html',
  'login members.html',
  'profile.html',
  'service.html',
  'service list.html',
  'store.html',
  'online bill.html',
  'save data.html',
  'admin.html',
  'admin login.html',
  'admin login script.js',
  'amc.html',
  'cart.html',
  'control profile.html',
  'customer detail.html',
  'data manager.html',
  'database.html',
  'delete data.html',
  'manifest.json',
  'sw.js',
  // Images
  'a.jpg',
  'b.jpg',
  'c.jpg',
  'd.jpg',
  'hh.jpg',
  'images (5).jpeg',
  // Icons
  'icon-128x128.png',
  'icon-144x144.png',
  'icon-152x152.png',
  'icon-192x192.png',
  'icon-256x256.png',
  'icon-512x512.png',
  // External Fonts
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
];

// இன்ஸ்டால் செய்யும்போது ஃபைல்களை சேமித்தல்
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching all assets');
      return cache.addAll(ASSETS);
    })
  );
});

// பழைய கேச் (Cache) கோப்புகளை நீக்குதல்
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
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
