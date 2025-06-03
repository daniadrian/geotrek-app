// src/js/utils/indexeddb-helper.js
import { openDB } from "idb";

const DATABASE_NAME = "geotrek-db";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "stories";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    database.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
  },
});

const IndexedDbHelper = {
  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async putStory(story) {
    if (!story.hasOwnProperty("id")) {
      return;
    }
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  async clearAllStories() {
    return (await dbPromise).clear(OBJECT_STORE_NAME);
  },
};

export default IndexedDbHelper;
