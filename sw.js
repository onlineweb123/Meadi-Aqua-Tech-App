const CACHE_NAME = 'aquatech-v3'; // Version update
const ASSETS = [
  '/',
  'index.html',
  'login.html',
  'amc.html',
  'cart.html',
  'forgot.html',
  'notification.html',
  'offer.html',
  'profile history.html',
  'service.html',
  'store.html',
  'manifest.json',
  'sw.js',
  // Images (வீடியோவில் உள்ளபடி மாற்றப்பட்டுள்ளது)
  'a.jpg',
  'b.jpg',
  'c.jpg',
  'd.jpg',
  'e.jpg',
  'f.jpg',
  'g.jpg',
  'h.jpg',
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
      // இதில் ஒரு ஃபைல் இல்லை என்றாலும் மொத்த கேச்சும் ஃபெயில் ஆகிவிடும்.
      // எனவே கவனமாக சரிபார்க்கவும்.
      return cache.addAll(ASSETS).catch(err => console.error("Cache addAll error:", err));
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
