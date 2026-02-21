const CACHE_NAME = 'designer-pro-v2'; // Naikkan versi jika kamu update kode
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png', // Tambahkan ikon agar bisa muncul offline
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// 1. Install Service Worker & Simpan Assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('✅ SW: Caching assets');
      return cache.addAll(assets);
    })
  );
});

// 2. Bersihkan Cache Lama (Agar aplikasi selalu fresh)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 3. Strategi: Network First (Coba ambil data internet dulu, kalau gagal baru ambil cache)
// Ini penting agar data Google Sheets kamu selalu yang terbaru!
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
