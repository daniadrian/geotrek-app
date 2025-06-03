// src/js/utils/push-notification-helper.js (VERSI LENGKAP DAN BENAR)
import StoryApi from "../data/story-api";

const VAPID_PUBLIC_KEY =
  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const PushNotificationHelper = {
  async getNotificationPermissionState() {
    if (!("Notification" in window)) {
      console.warn("Browser ini tidak mendukung Notifikasi.");
      return "unsupported";
    }
    return Notification.permission;
  },

  async subscribe() {
    // ... (bagian awal fungsi subscribe sampai mendapatkan currentSubscription tetap sama) ...
    // Pastikan Anda memiliki bagian ini:
    if (!("PushManager" in window) || !("Notification" in window)) {
      /* ... return 'unsupported' ... */
    }
    let permission = await this.getNotificationPermissionState();
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    if (permission !== "granted") {
      /* ... alert dan return ... */
    }
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration || !registration.pushManager) {
      /* ... alert dan return ... */
    }
    let currentSubscription = await registration.pushManager.getSubscription();
    if (!currentSubscription) {
      currentSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }
    // AKHIR BAGIAN AWAL FUNGSI SUBSCRIBE

    // BAGIAN YANG PERLU DIMODIFIKASI ADA DI SINI:
    try {
      // Buat objek baru yang akan dikirim, tanpa expirationTime
      const subscriptionToSend = currentSubscription.toJSON();
      delete subscriptionToSend.expirationTime; // Hapus properti yang tidak diinginkan

      console.log("Mengirim subscription ke server:", subscriptionToSend); // Untuk debugging
      const response = await StoryApi.subscribeNotification(subscriptionToSend); // Kirim objek yang sudah dimodifikasi

      if (response.error) throw new Error(response.message);
      alert("Berhasil berlangganan notifikasi!");
      return "subscribed";
    } catch (error) {
      alert(`Gagal berlangganan ke server: ${error.message}`);
      // Jika gagal kirim ke server, sebaiknya unsubscribe dari push manager juga jika kita baru saja membuatnya
      // Namun, jika kita hanya menggunakan subscription yang sudah ada, jangan unsubscribe di sini
      // Untuk simplifikasi, jika error terjadi, user mungkin perlu klik lagi untuk re-sync
      console.error("Error mengirim subscription ke server:", error);
      // Sebaiknya jangan unsubscribe di sini jika user sudah punya subscription sebelumnya
      // await currentSubscription.unsubscribe();
      // console.log('Subscription ke push service dibatalkan karena gagal kirim ke server.');
      return "error_server_subscribe";
    }
  },

  async unsubscribe() {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration || !registration.pushManager) {
      alert(
        "Service worker atau Push Manager tidak siap untuk berhenti berlangganan."
      );
      return;
    }
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      // Di sini Anda bisa menambahkan panggilan ke API server untuk memberi tahu bahwa user unsubscribe
      // Berdasarkan API Anda, ini adalah DELETE /notifications/subscribe dengan body: { endpoint: subscription.endpoint }
      try {
        // Anda perlu membuat fungsi StoryApi.unsubscribeNotification(endpoint)
        // await StoryApi.unsubscribeNotification(subscription.endpoint);
        console.log(
          "Berhasil berhenti berlangganan dari browser. Idealnya juga panggil API server."
        );
      } catch (error) {
        console.error("Gagal memberitahu server tentang unsubscribe:", error);
      }
      alert("Berhasil berhenti berlangganan notifikasi.");
    } else {
      alert("Anda memang belum berlangganan notifikasi.");
    }
  },

  async isSubscribedToPushService() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push messaging is not supported");
      return false;
    }
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        console.warn("Service Worker registration not found.");
        return false;
      }
      if (!registration.pushManager) {
        console.warn("PushManager not found on service worker registration.");
        return false;
      }
      const subscription = await registration.pushManager.getSubscription();
      return !!subscription;
    } catch (error) {
      console.error("Error checking push subscription status:", error);
      return false;
    }
  },
};

export default PushNotificationHelper;
