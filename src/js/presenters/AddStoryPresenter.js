// src/js/presenters/AddStoryPresenter.js

class AddStoryPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;

    this._listenToFormSubmit();
  }

  _listenToFormSubmit() {
    this._view.form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const { description, lat, lon } = this._view.getFormData();
      const photo = await this._view.getPhotoBlob();

      if (!photo || !description) {
        alert("Gambar dan deskripsi wajib diisi.");
        return;
      }

      try {
        const response = await this._model.addNewStory({
          description,
          photo,
          lat,
          lon,
        });
        if (response.error) {
          throw new Error(response.message);
        }
        alert("Cerita berhasil ditambahkan!");
        window.location.hash = "#/";
      } catch (error) {
        alert(`Gagal menambahkan cerita: ${error.message}`);
      }
    });
  }
}

export default AddStoryPresenter;
