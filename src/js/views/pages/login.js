// src/js/views/pages/login.js

import LoginPresenter from "../../presenters/LoginPresenter";
import StoryApi from "../../data/story-api";

const Login = {
  render() {
    return `
      <div class="login-container">
        <h2>Login ke GeoTrek</h2>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email-input" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password-input" name="password" minlength="8" required>
          </div>
          <button type="submit">Login</button>
        </form>
        <p class="register-link">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
      </div>
    `;
  },

  afterRender() {
    // Inisialisasi Presenter dan menghubungkannya dengan View ini dan Model
    new LoginPresenter({
      view: this,
      model: StoryApi,
    });
  },

  // Menyediakan akses ke elemen form untuk Presenter
  get loginForm() {
    return document.querySelector("#login-form");
  },

  // Menyediakan metode untuk mengambil nilai input untuk Presenter
  getLoginInput() {
    const email = document.querySelector("#email-input").value;
    const password = document.querySelector("#password-input").value;
    return { email, password };
  },
};

export default Login;
