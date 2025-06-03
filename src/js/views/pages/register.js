// src/js/views/pages/register.js

import RegisterPresenter from "../../presenters/RegisterPresenter";
import StoryApi from "../../data/story-api";

const Register = {
  render() {
    return `
      <div class="register-container">
        <h2>Daftar Akun Baru</h2>
        <form id="register-form">
          <div class="form-group">
            <label for="name-input">Nama</label>
            <input type="text" id="name-input" name="name" required>
          </div>
          <div class="form-group">
            <label for="email-input">Email</label>
            <input type="email" id="email-input" name="email" required>
          </div>
          <div class="form-group">
            <label for="password-input">Password</label>
            <input type="password" id="password-input" name="password" minlength="8" required>
          </div>
          <button type="submit">Daftar</button>
        </form>
      </div>
    `;
  },

  afterRender() {
    new RegisterPresenter({
      view: this,
      model: StoryApi,
    });
  },

  get form() {
    return document.querySelector("#register-form");
  },

  getRegisterInput() {
    const name = document.querySelector("#name-input").value;
    const email = document.querySelector("#email-input").value;
    const password = document.querySelector("#password-input").value;
    return { name, email, password };
  },
};

export default Register;
