// src/js/presenters/LoginPresenter.js

class LoginPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;

    this._listenToFormSubmit();
  }

  _listenToFormSubmit() {
    this._view.loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const { email, password } = this._view.getLoginInput();
      if (!email || !password) {
        alert("Email and password are required.");
        return;
      }

      try {
        const response = await this._model.login({ email, password });
        if (response.error) {
          alert(`Login Failed: ${response.message}`);
          return;
        }

        alert("Login Success!");
        this._saveAuthToken(response.loginResult.token);
        this._saveUserName(response.loginResult.name);
        this._redirectUser();
      } catch (error) {
        alert(`An error occurred: ${error.message}`);
      }
    });
  }

  _saveAuthToken(token) {
    // Kriteria: Menyimpan token. localStorage adalah pilihan sederhana.
    localStorage.setItem("authToken", token);
  }

  _saveUserName(name) {
    localStorage.setItem("userName", name);
  }

  _redirectUser() {
    // Mengubah href akan memaksa reload halaman ke root aplikasi
    window.location.hash = "/";
  }
}

export default LoginPresenter;
