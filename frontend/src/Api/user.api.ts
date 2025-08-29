import axios from "axios";
import type { ForgotPasswordFormValues, LoginFormValues, ResetPasswordFormValues } from "src/Types/forms.ts";
import type { RegisterFormValues } from "src/Types/forms.ts";
import api from "./config.api.ts";

const user = {
  login: (credentials: LoginFormValues) => api.post("/auth/login", credentials),
  signUp: (userData: RegisterFormValues) => api.post("/auth/register", userData),
  forgotPassword: (data: ForgotPasswordFormValues) => api.post("/auth/forgot-password", data),
  loginWithTemporaryPassword: (data: LoginFormValues) => api.post("/auth/login-by-temporary-password", data),
  resetPassword: (data: ResetPasswordFormValues) => api.post(`/auth/reset-password`, data),
  logout: () => api.post("/auth/logout"),
  getInfor: () => api.get(`/user/getinfor`)
};

export default user;