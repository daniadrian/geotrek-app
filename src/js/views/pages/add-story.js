// src/js/views/pages/add-story.js
import L from "leaflet";
import AddStoryPresenter from "../../presenters/AddStoryPresenter"; // Impor Presenter
import StoryApi from "../../data/story-api"; // Impor Model

const AddStory = {
  render() {
    return `
      <div class="add-story-container">
        <h2>Tambah Cerita Baru</h2>
        <form id="add-story-form">
          <a href="#/" class="back-button" style="margin-bottom: 1.5rem;"> 
            &larr; Kembali ke Home
          </a>

          <div class="camera-section">
            <h3>Ambil Foto</h3>
            <div id="camera-container" class="camera-container">
              <video id="camera-video" autoplay playsinline></video>
              <canvas id="photo-canvas" style="display:none;"></canvas>
            </div>
            <img id="photo-preview" class="photo-preview" src="#" alt="Pratinjau Foto" style="display:none;">
            <div class="camera-buttons">
              <button type="button" id="start-camera-btn">Mulai Kamera</button>
              <button type="button" id="capture-photo-btn" disabled>Ambil Gambar</button>
            </div>
          </div>

          <div class="form-group">
            <label for="description-input">Deskripsi</label>
            <textarea id="description-input" name="description" rows="4" required></textarea>
          </div>

          <div class="map-section">
            <h3>Pilih Lokasi</h3>
            <button type="button" id="use-gps-btn" class="gps-button">📍 Gunakan Lokasi Saya</button>
            <div id="map" style="height: 300px; width: 100%; margin-top: 1rem;"></div>
            <input type="hidden" id="lat-input" name="lat">
            <input type="hidden" id="lon-input" name="lon">
          </div>

          <button type="submit" id="submit-story-btn">Bagikan Cerita</button>
        </form>
      </div>
    `;
  },

  afterRender() {
    // --- Logika Kamera ---
    const video = document.querySelector("#camera-video");
    const canvas = document.querySelector("#photo-canvas");
    const preview = document.querySelector("#photo-preview");
    const startBtn = document.querySelector("#start-camera-btn");
    const captureBtn = document.querySelector("#capture-photo-btn");
    let stream = null;

    startBtn.addEventListener("click", async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = "block";
        preview.style.display = "none";
        startBtn.disabled = true;
        captureBtn.disabled = false;
      } catch (err) {
        alert("Tidak bisa mengakses kamera. Pastikan Anda memberikan izin.");
      }
    });

    captureBtn.addEventListener("click", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      preview.src = canvas.toDataURL("image/jpeg");
      preview.style.display = "block";
      video.style.display = "none";

      // Kriteria Wajib 4: Matikan stream kamera setelah tidak digunakan
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      startBtn.disabled = false;
      captureBtn.disabled = true;
    });

    // --- Logika Peta ---
    // Kriteria Wajib 3 & 4: Peta Digital
    // GANTI DENGAN API KEY ANDA dari MapTiler, dsb.
    // Sertakan API Key di STUDENT.txt
    const MAP_API_KEY = "Nwlgvpjr5ilTxE5E0b17";
    const latInput = document.querySelector("#lat-input");
    const lonInput = document.querySelector("#lon-input");
    const useGpsBtn = document.querySelector("#use-gps-btn");

    const map = L.map("map").setView([-6.2088, 106.8456], 13); // Default di Jakarta

    const streetsLayer = L.tileLayer(
      `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAP_API_KEY}`,
      {
        attribution: "...",
      }
    );
    const satelliteLayer = L.tileLayer(
      `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${MAP_API_KEY}`,
      {
        attribution: "...",
      }
    );

    // Tambahkan layer default ke peta
    streetsLayer.addTo(map);

    const baseMaps = {
      Streets: streetsLayer,
      Satellite: satelliteLayer,
    };

    // Tambahkan kontrol layer ke peta
    L.control.layers(baseMaps).addTo(map);

    const marker = L.marker([-6.2088, 106.8456]).addTo(map);
    marker.bindPopup("Lokasi cerita Anda").openPopup();
    latInput.value = map.getCenter().lat; // Set nilai awal
    lonInput.value = map.getCenter().lng;

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      latInput.value = lat;
      lonInput.value = lng;
    });

    useGpsBtn.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 15); // Zoom ke lokasi GPS
            marker.setLatLng([latitude, longitude]);
            latInput.value = latitude;
            lonInput.value = longitude;
          },
          (error) => {
            alert(`Gagal mendapatkan lokasi GPS: ${error.message}`);
          }
        );
      } else {
        alert("Geolocation tidak didukung oleh browser ini.");
      }
    });

    new AddStoryPresenter({
      view: this,
      model: StoryApi,
    });
  },
  // Metode untuk Presenter
  get form() {
    return document.querySelector("#add-story-form");
  },

  get canvas() {
    return document.querySelector("#photo-canvas");
  },

  getFormData() {
    const description = document.querySelector("#description-input").value;
    const lat = document.querySelector("#lat-input").value;
    const lon = document.querySelector("#lon-input").value;
    return { description, lat, lon };
  },

  getPhotoBlob() {
    return new Promise((resolve) => {
      this.canvas.toBlob(resolve, "image/jpeg");
    });
  },
};

export default AddStory;
