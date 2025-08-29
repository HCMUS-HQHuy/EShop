import api from "./config.api.ts";

const categories = {
  getAll: () => api.get("user/categories/list"),
  fetchTopLevel: () => api.get("user/categories/toplevel"),
};

export default categories;