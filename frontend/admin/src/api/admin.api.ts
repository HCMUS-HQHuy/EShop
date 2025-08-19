import axios from "axios";
import type { LoginFormValues } from "../types/credentials.ts";
console.log("API initialized with base URL:", import.meta.env.VITE_BACK_END_URL);
const api = axios.create({
  baseURL: import.meta.env.VITE_BACK_END_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const user = {
  login: (credentials: LoginFormValues) => api.post("/admin/auth/login", credentials),
  logout: () => api.post("/admin/auth/logout"),
  getInfor: () => api.get(`/admin/getinfor`)
};

export default user;