import axios from "axios";
import type { LoginFormValues } from "Types/credentials.ts";
import type { RegisterFormValues } from "Types/credentials.ts";
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
  login: (credentials: LoginFormValues) => api.post("/auth/login", credentials),
  signUp: (userData: RegisterFormValues) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getInfor: () => api.get(`/user/getinfor`)
};

export default user;