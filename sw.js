const CACHE_NAME = 'hadith-cache-v2.0.0';

const ASSETS_TO_CACHE = [
    // ROOT
    './',
    // HTML
    './index.html',
    './subjects.html',
    './content.html',
    './duaas.html',
    './favourites.html',
    './mutafariqa-list.html',
    './ahadith-mutafariqa.html',
    './offline.html',
    // CSS
    './assets/style/index.css',
    './assets/style/subjects.css',
    './assets/style/content.css',
    './assets/style/duaas.css',
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
    './assets/script/subjects.js',
    './assets/script/content.js',
    './assets/script/duaas.js',
    './assets/script/favourites.js',
    './assets/script/mutafariqa-list.js',
    './assets/script/ahadith-mutafariqa.js',
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
    // Content (local database, data written by Ali Mahdi)
    './data/index.json',
    './data/hadith.json',
    './data/ahl-albayt.json',
    './data/duaas.json',
    './data/zyarat.json',
    './data/munajat.json',
    './data/khutab.json',
    // Ahadith Mutafariqa from net (local json, data source is unknown)
    './data/api/shia/mutafariqa-list.json',
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