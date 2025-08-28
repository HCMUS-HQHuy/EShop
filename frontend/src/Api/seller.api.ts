import axios from "axios";
import type { SellerRegistrationFormValues } from "src/Types/forms.ts";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const seller = {
  createShop: (shopData: SellerRegistrationFormValues) => api.post(`/seller/shop/create`, shopData),
  getShopInfo: () => api.get(`/seller/shop/getinformation`)
};

export default seller;