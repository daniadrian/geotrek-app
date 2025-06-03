import "./styles/main.css";

import L from "leaflet";

// Impor semua modul CSS komponen
import "./styles/components/_app-bar.css";
import "./styles/components/_card.css";
import "./styles/components/_forms.css";
import "./styles/components/_footer.css";
import "./styles/components/_utilities.css";
import "./styles/components/_fab.css";

// Impor semua modul CSS halaman
import "./styles/pages/_home.css";
import "./styles/pages/_detail.css";
import "./styles/pages/_add-story.css";

import router from "./js/routes/router";

// ATUR PATH DEFAULT UNTUK IKON LEAFLET
// Baris ini terkadang diperlukan untuk beberapa kombinasi Leaflet & bundler
// untuk memastikan path ikon yang kita tentukan di bawah ini digunakan.
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "leaflet-images/marker-icon-2x.png", // Path relatif dari root folder public
  iconUrl: "leaflet-images/marker-icon.png", // Path relatif dari root folder public
  shadowUrl: "leaflet-images/marker-shadow.png", // Path relatif dari root folder public
});
// AKHIR DARI PENGATURAN IKON LEAFLET

// Event listener untuk memuat konten berdasarkan hash saat pertama kali dibuka
window.addEventListener("DOMContentLoaded", () => {
  router();
});

// Event listener untuk memuat konten saat hash berubah
window.addEventListener("hashchange", () => {
  router();
});
