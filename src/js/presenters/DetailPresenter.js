// src/js/presenters/DetailPresenter.js
class DetailPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;

    this._getStoryDetail();
  }

  async _getStoryDetail() {
    try {
      const storyId = this._getStoryIdFromUrl();
      const response = await this._model.getStoryDetail(storyId);
      if (response.error) {
        throw new Error(response.message);
      }

      this._view.renderStory(response.story);

      await this._view.renderLikeButton(response.story);
    } catch (error) {
      alert(`Gagal memuat cerita: ${error.message}`);
    }
  }

  _getStoryIdFromUrl() {
    const url = window.location.hash.slice(1);
    const urlSplits = url.split("/");
    return urlSplits[urlSplits.length - 1]; // Ambil bagian terakhir dari URL sebagai ID
  }
}

export default DetailPresenter;
