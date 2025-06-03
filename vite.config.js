import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default ({ command }) => {
  //const base = command === "build" ? "/geotrek-app/" : "/"; // Sesuaikan '/geotrek-app/' jika nama repo Anda berbeda
  const repoName = "geotrek-app"; // <-- GANTI INI DENGAN NAMA REPO ANDA
  const base = command === "build" ? `/${repoName}/` : "/";
  // const base = "/";

  return defineConfig({
    base: base,
    plugins: [
      VitePWA({
        manifest: {
          name: "GeoTrek - Adventure Story Sharing",
          short_name: "GeoTrek",
          description:
            "Aplikasi untuk berbagi cerita petualanganmu di seluruh dunia.",
          start_url: ".",
          display: "standalone",
          background_color: "#f8f9fa",
          theme_color: "#005A8D",
          scope: base,
          icons: [
            {
              src: "icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
          // Di dalam vite.config.js, di dalam opsi VitePWA:
          // manifest: {
          //   name: "GeoTrek Minimal",
          //   short_name: "GeoTrekMin",
          //   start_url: ".", // Titik (.) berarti relatif terhadap lokasi manifest
          //   display: "standalone",
          //   background_color: "#ffffff",
          //   theme_color: "#000000",
          //   icons: [
          //     {
          //       src: "icons/icons-192x192.png", // Pastikan path ini benar dari folder public
          //       sizes: "192x192",
          //       type: "image/png",
          //     },
          //   ],
          //   //   Sementara kita hapus 'scope' untuk melihat apakah itu penyebabnya
          // },
        },
        // Untuk injectManifest, workbox di sini bisa dikosongkan atau diisi opsi build.
        // Strategi caching utama ada di src/service-worker.js
        workbox: {},
        strategies: "injectManifest",
        srcDir: "src", // Lokasi service-worker.js custom kita
        filename: "service-worker.js", // Nama file SW yang akan di-output
      }),
    ],
    preview: {
      base: base,
    },
  });
};

// Isi Workbox
// globPatterns: ["**/*.{js,css,html,ico,png,svg}"], // Cache semua aset shell
// runtimeCaching: [
//   {
//     // Cache request ke API cerita
//     urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\/stories/,
//     handler: "NetworkFirst", // Coba jaringan dulu, jika gagal baru ambil dari cache
//     options: {
//       cacheName: "geotrek-stories-api",
//       expiration: {
//         maxEntries: 50,
//         maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
//       },
//     },
//   },
//   {
//     // Cache gambar cerita
//     urlPattern:
//       /^https:\/\/story-api\.dicoding\.dev\/images\/stories\//,
//     handler: "StaleWhileRevalidate", // Gunakan cache dulu sambil memperbarui di background
//     options: {
//       cacheName: "geotrek-stories-images",
//       expiration: {
//         maxEntries: 100,
//         maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
//       },
//     },
//   },
// ],
