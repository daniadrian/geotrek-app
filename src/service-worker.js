// src/service-worker.js
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies";

// Ini akan digantikan oleh VitePWA dengan daftar aset yang akan di-precache
// Pastikan semua file penting (HTML, CSS, JS utama, ikon) tercakup.
// VitePWA biasanya menangani ini dengan baik jika globPatterns di workbox (jika generateSW)
// atau proses build (jika injectManifest) sudah benar.
precacheAndRoute(self.__WB_MANIFEST);

// Menangani Push Notification
self.addEventListener("push", (event) => {
  console.log("Push received:", event.data.text());
  const notificationData = JSON.parse(event.data.text());
  const { title, options } = notificationData;
  event.waitUntil(self.registration.showNotification(title, options));
});

// Aturan caching untuk API cerita
registerRoute(
  ({ url }) => url.href.startsWith("https://story-api.dicoding.dev/v1/stories"),
  new NetworkFirst({
    cacheName: "geotrek-stories-api",
    plugins: [
      // Anda bisa menambahkan plugin Workbox lain di sini jika perlu,
      // misalnya untuk menangani response error atau expiration.
    ],
  })
);

// Aturan caching untuk gambar cerita
registerRoute(
  ({ url }) =>
    url.href.startsWith("https://story-api.dicoding.dev/images/stories/"),
  new StaleWhileRevalidate({
    cacheName: "geotrek-stories-images",
    plugins: [
      // Contoh: Batasi jumlah gambar yang di-cache dan masa berlakunya
      // new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 })
    ],
  })
);
