// src/js/views/pages/detail.js
import L from "leaflet";
import DetailPresenter from "../../presenters/DetailPresenter";
import StoryApi from "../../data/story-api";
import FavoriteStoryIdb from "../../data/database-helper";
import {
  createLikeButtonTemplate,
  createLikedButtonTemplate,
} from "../templates/template-creator";

const Detail = {
  render() {
    // Container untuk detail dan tombol like sekarang di render bersamaan
    return `
      <div id="story-detail-container">
        <p>Memuat detail cerita...</p>
      </div>
      <div id="likeButtonContainer" class="like-button-container-detail"></div>
    `;
  },

  async afterRender() {
    // Cukup inisialisasi Presenter, biarkan Presenter yang bekerja
    new DetailPresenter({
      view: this,
      model: StoryApi,
    });
  },

  renderStory(story) {
    const container = document.querySelector("#story-detail-container");
    if (!container) return;
    const hasLocation = story.lat && story.lon;

    container.innerHTML = `
      <a href="#/" class="back-button">
        &larr; Kembali ke Home
      </a>
      <div class="story-detail-layout ${hasLocation ? "has-map" : ""}">
        <div class="story-detail__main">
          <img src="${story.photoUrl}" alt="Foto oleh ${
      story.name
    }" class="story-detail__image">
          <div class="story-detail__content">
            <h2 class="story-detail__name">${story.name}</h2>
            <p class="story-detail__date">Dibuat pada ${new Date(
              story.createdAt
            ).toLocaleString()}</p>
            <p class="story-detail__description">${story.description}</p>
          </div>
        </div>
        ${
          hasLocation
            ? `
          <div class="story-detail__map-container">
            <h3>Lokasi Cerita</h3>
            <div id="detail-map" class="story-detail__map"></div>
          </div>
        `
            : `
          <div class="story-detail__map-container">
            <h3>Lokasi Cerita</h3>
            <p>Lokasi tidak tersedia untuk cerita ini.</p>
          </div>
        `
        }
      </div>
    `;

    if (hasLocation) {
      this._initMap(story.lat, story.lon);
    }
  },

  async renderLikeButton(story) {
    const likeButtonContainer = document.querySelector("#likeButtonContainer");
    if (!likeButtonContainer || !story) return;

    // 1. Cek ke database apakah cerita ini sudah jadi favorit
    const isFavorited = !!(await FavoriteStoryIdb.getStory(story.id));

    // 2. Render tombol yang sesuai (hati kosong atau hati terisi)
    likeButtonContainer.innerHTML = isFavorited
      ? createLikedButtonTemplate()
      : createLikeButtonTemplate();

    // 3. Tambahkan event listener untuk klik
    const likeButton = document.querySelector("#likeButton");
    if (likeButton) {
      likeButton.addEventListener("click", async () => {
        // Cek lagi status favorit saat tombol diklik
        const isNowFavorited = !!(await FavoriteStoryIdb.getStory(story.id));
        if (isNowFavorited) {
          // Jika sudah favorit, hapus dari database
          await FavoriteStoryIdb.deleteStory(story.id);
        } else {
          // Jika belum favorit, simpan ke database
          await FavoriteStoryIdb.putStory(story);
        }
        // Render ulang tombol untuk menampilkan status baru (UI update)
        await this.renderLikeButton(story);
      });
    }
  },

  _initMap(lat, lon) {
    const MAP_API_KEY = "Nwlgvpjr5ilTxE5E0b17"; // Ganti dengan API Key Anda
    const map = L.map("detail-map").setView([lat, lon], 15);
    // Definisikan layer-layer peta
    const streetsLayer = L.tileLayer(
      `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAP_API_KEY}`,
      {
        attribution:
          '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
      }
    );
    const satelliteLayer = L.tileLayer(
      `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${MAP_API_KEY}`,
      {
        attribution:
          '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
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

    // Tambahkan marker lokasi
    L.marker([lat, lon]).addTo(map).bindPopup("Lokasi cerita").openPopup();
  },
};

export default Detail;
