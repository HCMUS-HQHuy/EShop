import { formatProducts } from "src/Functions/formatting.ts";
import api from "./config.api.ts";
import type { ForgotPasswordFormValues, LoginFormValues, ResetPasswordFormValues } from "src/Types/forms.ts";
import type { RegisterFormValues } from "src/Types/forms.ts";

const user = {
  validToken: () => api.get("/auth/validate-token"),
  login: (credentials: LoginFormValues) => api.post("/auth/login", credentials),
  signUp: (userData: RegisterFormValues) => api.post("/auth/register", userData),
  forgotPassword: (data: ForgotPasswordFormValues) => api.post("/auth/forgot-password", data),
  loginWithTemporaryPassword: (data: LoginFormValues) => api.post("/auth/login-by-temporary-password", data),
  resetPassword: (data: ResetPasswordFormValues) => api.post(`/auth/reset-password`, data),
  logout: () => api.post("/auth/logout"),
  getInfor: () => api.get(`/user/getinfor`),
  createOrder: (orderData: any) => api.post('user/orders/create', orderData),
  getOrders: () => api.get(`/user/orders`),
  fetchProducts: (data?: { offset?: number, limit?:number, order?:string, search?:string }) => api.get(`/user/products?offset=${data?.offset || 0}&limit=${data?.limit || 10}&order=${data?.order}&keywords=${data?.search || ''}`).then(res => {
    formatProducts(res.data.products);
    return res;
  }),
  getRelatedProducts: (productId: number) => api.get(`/user/products/${productId}/related-items`).then(res => {
    formatProducts(res.data.products);
    return res;
  }),
};

export default user;