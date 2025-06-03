// src/js/data/story-api.js

import API_ENDPOINT from "../config/api-endpoint";
import AuthHelper from "../utils/auth-helper";

class StoryApi {
  static async register({ name, email, password }) {
    const response = await fetch(
      API_ENDPOINT.BASE_URL + API_ENDPOINT.REGISTER,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      }
    );
    return response.json();
  }

  static async login({ email, password }) {
    const response = await fetch(API_ENDPOINT.BASE_URL + API_ENDPOINT.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  // Fungsi baru untuk mengambil semua cerita
  static async getAllStories() {
    const token = AuthHelper.getToken();
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(
      API_ENDPOINT.BASE_URL + API_ENDPOINT.GET_ALL_STORIES,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  }
  static async addNewStory({ description, photo, lat, lon }) {
    const token = AuthHelper.getToken();
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo); // 'photo' adalah file/blob
    formData.append("lat", lat);
    formData.append("lon", lon);

    const response = await fetch(
      API_ENDPOINT.BASE_URL + API_ENDPOINT.ADD_STORY,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type tidak perlu diset, browser akan menanganinya untuk FormData
        },
        body: formData,
      }
    );
    return response.json();
  }
  static async addNewStory({ description, photo, lat, lon }) {
    const token = AuthHelper.getToken();
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo); // 'photo' adalah file/blob
    formData.append("lat", lat);
    formData.append("lon", lon);

    const response = await fetch(
      API_ENDPOINT.BASE_URL + API_ENDPOINT.ADD_STORY,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type tidak perlu diset, browser akan menanganinya untuk FormData
        },
        body: formData,
      }
    );
    return response.json();
  }

  static async subscribeNotification(subscription) {
    const token = AuthHelper.getToken();
    // Endpoint dari dokumentasi API
    const response = await fetch(
      `${API_ENDPOINT.BASE_URL}/notifications/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
      }
    );
    return response.json();
  }

  static async getStoryDetail(id) {
    const token = AuthHelper.getToken();
    if (!token) throw new Error("User not authenticated");

    const response = await fetch(
      API_ENDPOINT.BASE_URL + API_ENDPOINT.DETAIL_STORY(id),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  }
}

// Fungsi untuk endpoint lain (get stories, add story, etc.) akan kita tambahkan di sini nanti.

export default StoryApi;
