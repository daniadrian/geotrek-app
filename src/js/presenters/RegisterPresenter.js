// src/js/presenters/RegisterPresenter.js

class RegisterPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;

    this._listenToFormSubmit();
  }

  _listenToFormSubmit() {
    this._view.form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const { name, email, password } = this._view.getRegisterInput();

      if (!name || !email || !password) {
        alert("Semua field wajib diisi.");
        return;
      }

      try {
        const response = await this._model.register({ name, email, password });
        if (response.error) {
          throw new Error(response.message);
        }
        alert("Pendaftaran berhasil! Silakan login.");
        window.location.hash = "#/login"; // Arahkan ke halaman login setelah berhasil
      } catch (error) {
        alert(`Pendaftaran gagal: ${error.message}`);
      }
    });
  }
}

export default RegisterPresenter;
