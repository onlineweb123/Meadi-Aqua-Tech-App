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

// --- EXISTING LOGIC: Install ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching all assets');
      return cache.addAll(ASSETS).catch(err => console.error("Cache addAll error:", err));
    })
  );
});

// --- EXISTING LOGIC: Activate ---
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

// --- EXISTING LOGIC: Fetch ---
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// --- NEW LOGIC: Push Notification Handling ---

// பேக்கிரவுண்டில் இருக்கும்போது மெசேஜ் வந்தால் இதோ இந்த ஈவன்ட் வேலை செய்யும்
self.addEventListener('push', (event) => {
    let data = { title: 'Meadi Aqua Tech', body: 'உங்களுக்கு ஒரு புதிய அறிவிப்பு உள்ளது!' };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = { title: 'Meadi Aqua Tech', body: event.data.text() };
        }
    }

    const options = {
        body: data.body,
        icon: 'icon-192x192.png', // உங்கள் ஐகான் ஃபைல் பெயர்
        badge: 'icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
            url: '/' // நோட்டிபிகேஷனை கிளிக் செய்தால் எங்கு போக வேண்டும்
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// நோட்டிபிகேஷனை கிளிக் செய்யும் போது நடக்கும் செயல்
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
