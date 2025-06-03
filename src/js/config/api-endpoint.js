const API_ENDPOINT = {
  BASE_URL: "https://story-api.dicoding.dev/v1",
  REGISTER: "/register",
  LOGIN: "/login",
  GET_ALL_STORIES: "/stories",
  ADD_STORY: "/stories",
  ADD_GUEST_STORY: "/stories/guest",
  DETAIL_STORY: (id) => `/stories/${id}`,
};

export default API_ENDPOINT;
