// src/js/routes/router.js (VERSI FINAL YANG BERSIH)

import Home from "../views/pages/home";
import Login from "../views/pages/login";
import Register from "../views/pages/register";
import AddStory from "../views/pages/add-story";
import Detail from "../views/pages/detail";
import AuthHelper from "../utils/auth-helper";
import PushNotificationHelper from "../utils/push-notification-helper";

const routes = {
  "/": Home,
  "/login": Login,
  "/register": Register,
  "/add": AddStory,
  "/detail/:id": Detail,
};

const updateAuthNav = async (request) => {
  const authNavContainer = document.querySelector("#auth-nav");
  if (!authNavContainer) {
    console.error("Elemen #auth-nav tidak ditemukan di DOM.");
    return;
  }

  if (AuthHelper.isUserLoggedIn()) {
    let bellIcon = "🔔"; // Default icon
    let buttonAction = null;
    let buttonClass = "notification-button";
    let buttonLabel = "Notifikasi";
    let isButtonDisabled = false;

    try {
      const permissionState =
        await PushNotificationHelper.getNotificationPermissionState();
      const isSubscribedToPush =
        await PushNotificationHelper.isSubscribedToPushService();

      if (permissionState === "granted") {
        if (isSubscribedToPush) {
          bellIcon = "✅";
          buttonClass += " subscribed";
          buttonLabel =
            "Anda Sudah Berlangganan Notifikasi. Klik untuk berhenti.";
          buttonAction = async () => {
            await PushNotificationHelper.unsubscribe();
            updateAuthNav(request);
          };
        } else {
          bellIcon = "➕";
          buttonClass += " needs-subscription";
          buttonLabel = "Aktifkan & Berlangganan Notifikasi";
          buttonAction = async () => {
            const result = await PushNotificationHelper.subscribe();
            // Perbarui UI hanya jika ada perubahan status yang relevan
            if (
              result === "subscribed" ||
              result === "granted" ||
              result === "denied" ||
              result === "default"
            ) {
              updateAuthNav(request);
            }
          };
        }
      } else if (permissionState === "default") {
        bellIcon = "🔔";
        buttonClass += " needs-permission";
        buttonLabel = "Izinkan Notifikasi";
        buttonAction = async () => {
          const result = await PushNotificationHelper.subscribe();
          updateAuthNav(request);
        };
      } else if (permissionState === "denied") {
        bellIcon = "🔕";
        buttonClass += " denied";
        buttonLabel = "Notifikasi Diblokir (Ubah di Pengaturan Browser Anda)";
        buttonAction = () => {
          alert(
            "Anda telah memblokir notifikasi untuk situs ini. Untuk mengaktifkannya, silakan ubah pengaturan notifikasi di browser Anda untuk situs ini."
          );
        };
      } else {
        // 'unsupported' atau error lainnya
        bellIcon = "❔";
        buttonClass += " disabled";
        buttonLabel = "Notifikasi Tidak Didukung / Error";
        isButtonDisabled = true;
        buttonAction = () => {
          alert(
            "Browser Anda tidak mendukung fitur notifikasi ini atau terjadi error saat pengecekan."
          );
        };
      }
    } catch (error) {
      console.error(
        "Error dalam logika updateAuthNav untuk notifikasi:",
        error
      );
      bellIcon = "⚠️";
      buttonLabel = "Error Notifikasi";
      isButtonDisabled = true;
    }

    authNavContainer.innerHTML = `
      <button id="notification-button" class="${buttonClass}" 
              aria-label="${buttonLabel}" ${isButtonDisabled ? "disabled" : ""}>
        ${bellIcon}
      </button>
      <button id="logout-button">Logout</button>
    `;

    const logoutButton = document.querySelector("#logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", (event) => {
        event.stopPropagation();
        AuthHelper.logout();
      });
    }

    const notifButton = document.querySelector("#notification-button");
    if (notifButton && buttonAction && !isButtonDisabled) {
      notifButton.addEventListener("click", async (event) => {
        event.stopPropagation();
        await buttonAction();
      });
    }
  } else {
    // Jika pengguna belum login
    if (request === "/login" || request === "/register") {
      authNavContainer.innerHTML = "";
    } else {
      authNavContainer.innerHTML = '<a href="#/login">Login</a>';
    }
  }
};

const router = async () => {
  const content = document.querySelector("#main-content");
  if (!content) {
    console.error("Elemen #main-content tidak ditemukan di DOM.");
    return;
  }
  const request = window.location.hash.slice(1).toLowerCase() || "/";

  const urlParts = request.split("/");
  const path = `/${urlParts[1] || ""}`;
  const id = urlParts[2] || "";

  const protectedRoutes = ["/add", "/detail"];
  if (protectedRoutes.includes(path) && !AuthHelper.isUserLoggedIn()) {
    window.location.hash = "#/login";
    return;
  }

  const matchedRoute = `/${urlParts[1] || ""}${id ? "/:id" : ""}`;
  const page = routes[matchedRoute] || Home;

  if (
    !page ||
    typeof page.render !== "function" ||
    typeof page.afterRender !== "function"
  ) {
    console.error(
      `Halaman untuk rute '${matchedRoute}' tidak valid atau tidak memiliki metode render/afterRender.`
    );
    content.innerHTML =
      "<p>Halaman tidak ditemukan atau terjadi kesalahan.</p>"; // Fallback UI
    updateAuthNav(path); // Tetap update navigasi header
    return;
  }

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      content.innerHTML = page.render();
      page.afterRender();
      updateAuthNav(path);
    });
  } else {
    content.innerHTML = page.render();
    page.afterRender();
    updateAuthNav(path);
  }
};

export default router;
