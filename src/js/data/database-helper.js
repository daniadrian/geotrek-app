// src/js/data/database-helper.js
import { openDB } from "idb";
import DATABASE_CONFIG from "../config/database-config";

const { DATABASE_NAME, DATABASE_VERSION, OBJECT_STORE_NAME } = DATABASE_CONFIG;

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
    }
  },
});

const FavoriteStoryIdb = {
  async getStory(id) {
    if (!id) {
      return undefined;
    }
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },
  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
  async putStory(story) {
    if (!story || !story.id) {
      return;
    }
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },
  async deleteStory(id) {
    if (!id) {
      return;
    }
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default FavoriteStoryIdb;
