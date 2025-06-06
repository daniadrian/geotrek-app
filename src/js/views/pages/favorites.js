// src/js/views/pages/favorites.js

import FavoriteStoryIdb from "../../data/database-helper";
import { createStoryItemTemplate } from "../templates/template-creator";

const Favorites = {
  render() {
    return `
      <div class="content">
        <h2 class="page-title">Cerita Favorit Anda</h2>
        <div id="stories-list" class="stories-list"> 
          </div>
      </div>
    `;
  },

  async afterRender() {
    const storiesContainer = document.querySelector("#stories-list");
    if (!storiesContainer) return;

    try {
      const stories = await FavoriteStoryIdb.getAllStories();

      if (stories.length === 0) {
        storiesContainer.innerHTML = `
          <p class="stories-not-found">Anda belum memiliki cerita favorit. Sukai sebuah cerita untuk menambahkannya di sini!</p>
        `;
        return;
      }

      storiesContainer.innerHTML = "";
      // Untuk halaman favorit, semua cerita pasti 'isFavorited' = true
      stories.forEach((story) => {
        storiesContainer.innerHTML += createStoryItemTemplate(story, true);
      });
    } catch (error) {
      console.error("Gagal memuat cerita favorit:", error);
      storiesContainer.innerHTML = `<p class="error-message">Terjadi kesalahan saat memuat cerita favorit.</p>`;
    }
  },
};

export default Favorites;
