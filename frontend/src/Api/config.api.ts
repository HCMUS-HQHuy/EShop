import axios from "axios";
console.log("API initialized with base URL:", import.meta.env.VITE_BASE_API_URL);
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default api;