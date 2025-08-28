import axios from "axios";
import type { ForgotPasswordFormValues, LoginFormValues, ResetPasswordFormValues } from "src/Types/forms.ts";
import type { RegisterFormValues } from "src/Types/forms.ts";
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
  forgotPassword: (data: ForgotPasswordFormValues) => api.post("/auth/forgot-password", data),
  resetPassword: (data: ResetPasswordFormValues) => api.post("/auth/reset-password", data),
  logout: () => api.post("/auth/logout"),
  getInfor: () => api.get(`/user/getinfor`)
};

export default user;