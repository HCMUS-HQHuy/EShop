import api from "./config.api.ts";
import type { SellerRegistrationFormValues } from "src/Types/forms.ts";

const seller = {
  createShop: (shopData: SellerRegistrationFormValues) => api.post(`/seller/shop/create`, shopData),
  getShopInfo: () => api.get(`/seller/shop/getinformation`)
};

export default seller;