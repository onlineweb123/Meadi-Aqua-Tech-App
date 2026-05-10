importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const CACHE_NAME = 'aquatech-v3';
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
  'a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg', 'f.jpg', 'g.jpg', 'h.jpg',
  'icon-128x128.png', 'icon-144x144.png', 'icon-152x152.png',
  'icon-192x192.png', 'icon-256x256.png', 'icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
];

// Firebase initialization inside SW
firebase.initializeApp({
    apiKey: "AIzaSyAqyyGJt_t0ztknMudFVLmo6relkEa284g",
    authDomain: "meadi-aqua-tech.firebaseapp.com",
    databaseURL: "https://meadi-aqua-tech-default-rtdb.firebaseio.com",
    projectId: "meadi-aqua-tech",
    storageBucket: "meadi-aqua-tech.firebasestorage.app",
    messagingSenderId: "531151217708",
    appId: "1:531151217708:web:b30b6e1a0bf7fa60f29d89"
});

const messaging = firebase.messaging();

// Background Notification Handling
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title || "Meadi Aqua Tech";
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'icon-192x192.png',
    badge: 'icon-192x192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Cache Logic
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Notification Click logic
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow('notification.html'));
});
