import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACK_END_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  }
});

const categories = {
  getAll: () => api.get("user/categories/list")
};

export default categories;