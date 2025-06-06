// src/js/views/pages/home.js
import AuthHelper from "../../utils/auth-helper";
import HomePresenter from "../../presenters/HomePresenter";
import StoryApi from "../../data/story-api";
import { createStoryItemTemplate } from "../templates/template-creator";

const Home = {
  render() {
    if (AuthHelper.isUserLoggedIn()) {
      const userName = AuthHelper.getUserName();
      return `
        <div id="offline-message" class="offline-message" style="display: none;"></div>
        <h2>Cerita Terbaru</h2>
        <div id="stories-list" class="stories-list">
          <p>Memuat cerita...</p>
        </div>
      `;
    }

    return `
      <section class="hero">
        <div class="hero__inner">
          <h1 class="hero__title">Selamat Datang di GeoTrek</h1>
          <p class="hero__tagline">Bagikan cerita petualanganmu, tinggalkan jejak digital di seluruh dunia.</p>
          <a href="#/login" class="hero__cta">Mulai Berpetualang</a>
        </div>
      </section>
    `;
  },

  afterRender() {
    if (AuthHelper.isUserLoggedIn()) {
      new HomePresenter({
        view: this,
        model: StoryApi,
      });
    }
  },

  showStories(stories) {
    const storiesContainer = document.querySelector("#stories-list");
    if (stories.length === 0) {
      storiesContainer.innerHTML = "<p>Belum ada cerita yang ditambahkan.</p>";
      return;
    }

    storiesContainer.innerHTML = "";
    stories.forEach((story) => {
      storiesContainer.innerHTML += createStoryItemTemplate(story);
    });
  },
  // Metode baru untuk menampilkan pesan offline
  showOfflineMessage() {
    const offlineMessageContainer = document.querySelector("#offline-message");
    offlineMessageContainer.style.display = "block";
    offlineMessageContainer.innerHTML =
      "Anda sedang offline. Data yang ditampilkan mungkin tidak yang terbaru.";
  },
};

export default Home;
