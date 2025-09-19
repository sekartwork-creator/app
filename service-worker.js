// ชื่อ cache ของแอป
const CACHE_NAME = "my-pwa-cache-v1";

// ไฟล์ที่ต้องการ cache
const urlsToCache = [
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// ติดตั้ง service worker และ cache ไฟล์
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // อัปเดตทันที
});

// ดึงไฟล์จาก cache ก่อน ถ้าไม่มีจึงไป fetch จาก network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// ลบ cache เก่าที่ไม่ใช่ version ปัจจุบัน
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});
