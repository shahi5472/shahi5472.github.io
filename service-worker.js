const CACHE_NAME = 'flutter-app-cache-v1';
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/flutter.js',
    '/flutter_service_worker.js',
    '/manifest.json',
    '/icons/Icon-192.png',
    '/icons/Icon-512.png',
    '/assets/images/background.jpg',
    '/assets/images/profile.jpg',
    '/assets/fonts/Roboto-Regular.ttf',
    'https://fonts.googleapis.com/css?family=Nunito'
];

// Install Service Worker and cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching Assets');
            return cache.addAll(CACHE_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activate Service Worker and remove old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Removing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch Event Listener to serve cached content
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
