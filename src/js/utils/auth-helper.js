// src/js/utils/auth-helper.js

const AuthHelper = {
  isUserLoggedIn() {
    return !!localStorage.getItem("authToken");
  },

  getToken() {
    return localStorage.getItem("authToken");
  },

  saveToken(token) {
    localStorage.setItem("authToken", token);
  },

  getUserName() {
    return localStorage.getItem("userName");
  },

  logout() {
    localStorage.removeItem("authToken");
    // Arahkan ke halaman login dan refresh untuk membersihkan state
    localStorage.removeItem("userName");
    window.location.hash = "#/login";
    window.location.reload();
  },
};

export default AuthHelper;
