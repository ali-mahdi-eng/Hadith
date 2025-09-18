const CACHE_NAME = 'hadith-cache-v1.9.1';

const ASSETS_TO_CACHE = [
    // ROOT
    './',
    // HTML
    './index.html',
    './sections.html',
    './subjects.html',
    './content.html',
    './favourites.html',
    './ahl-albyt-list.html',
    './hadith-ahl-albyt.html',
    './offline.html',
    // CSS
    './assets/style/index.css',
    './assets/style/subjects.css',
    './assets/style/content.css',
    './assets/style/fonts.css',
    './assets/style/theme/green.css',
    './assets/style/theme/dark-green.css',
    './assets/style/theme/teal.css',
    './assets/style/theme/light.css',
    './assets/style/theme/dark.css',
    // JS
    './assets/script/index.js',
    './assets/script/preloaded-theme.js',
    './assets/script/change-theme.js',
    './assets/script/app.js',
    './assets/script/sections.js',
    './assets/script/subjects.js',
    './assets/script/content.js',
    './assets/script/favourites.js',
    './assets/script/ahl-albyt-list.js',
    './assets/script/hadith-ahl-albyt.js',
    // Fonts
    './assets/fonts/El_Messiri-regular.woff2',
    './assets/fonts/Amiri.woff2',
    // './assets/fonts/Amiri_700.woff2',
    // Favicon
    './assets/icons/app_icon/android-chrome-512x512.png',
    './assets/icons/app_icon/android-chrome-192x192.png',
    './assets/icons/app_icon/apple-touch-icon.png',
    './assets/icons/app_icon/favicon.ico',
    // Images
    './assets/image/islamic-pattern-1.png',
    './assets/image/islamic-pattern-2.png',
    './assets/image/layer/image-1.png',
    './assets/image/layer/image-2.png',
    './assets/image/layer/image-3.png',
    './assets/image/layer/image-4.png',
    // web manifest (PWA)
    './manifest.json',
    // Content
    './data/hadith.json',
    './data/api/shia/ahl-albyt-list.json',
    './data/api/shia/Mohammed(PBUH).json',
    './data/api/shia/Imam_Ali(as).json',
    './data/api/shia/Fatima-Zahra(as).json',
    './data/api/shia/Imam_AL-Hasan(as).json',
    './data/api/shia/Imam_AL-Hussain(as).json',
    './data/api/shia/Imam_AL-Sejad(as).json',
    './data/api/shia/Imam_AL-Baqer(as).json',
    './data/api/shia/Imam_AL-Sadeq(as).json',
    './data/api/shia/Imam_AL-Kadhem(as).json',
    './data/api/shia/Imam_AL-Reza(as).json',
    './data/api/shia/Imam_AL-Jawad(as).json',
    './data/api/shia/Imam_AL-Hadi(as).json',
    './data/api/shia/Imam_AL-Askari(as).json',
    './data/api/shia/Imam_AL-Mahdi(as).json'
];

// Install service worker and cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting(); // Activate service worker immediately
});

// Activate new version and delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch strategy: stale-while-revalidate
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse || caches.match('./offline.html'));

        return cachedResponse || fetchPromise;
      })
    )
  );
});

// Listen for "skipWaiting" message to activate the new version immediately
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});