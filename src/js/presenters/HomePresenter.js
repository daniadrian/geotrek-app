// src/js/presenters/HomePresenter.js
import IndexedDbHelper from "../utils/indexeddb-helper"; // <-- Impor helper
import AuthHelper from "../utils/auth-helper.js";

class HomePresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;

    this._displayStories();
  }

  async _displayStories() {
    console.log(
      "Fungsi _displayStories dijalankan. Token yang ada:",
      AuthHelper.getToken()
    );
    try {
      const response = await this._model.getAllStories();
      if (response.error) {
        // Jika API mengembalikan error, coba fallback
        throw new Error(response.message);
      }

      await IndexedDbHelper.clearAllStories();
      response.listStory.forEach((story) => {
        IndexedDbHelper.putStory(story);
      });
      this._view.showStories(response.listStory);
      // Sembunyikan pesan offline jika ada, setelah berhasil dari network
      const offlineMessageContainer =
        document.querySelector("#offline-message");
      if (offlineMessageContainer)
        offlineMessageContainer.style.display = "none";
    } catch (error) {
      console.error(`Error fetching from network: ${error.message}`);
      this._view.showOfflineMessage();
      const cachedStories = await IndexedDbHelper.getAllStories();
      if (cachedStories && cachedStories.length > 0) {
        this._view.showStories(cachedStories);
      } else {
        this._view.showStories([]);
      }
    }
  }
}

export default HomePresenter;
