import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  }
});

const categories = {
  getAll: () => api.get("user/categories/list"),
  fetchTopLevel: () => api.get("user/categories/toplevel"),
};

export default categories;