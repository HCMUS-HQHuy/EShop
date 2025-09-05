import api from "./config.api.ts";
import type { SellerRegistrationFormValues } from "src/Types/forms.ts";

const seller = {
  createShop: (shopData: SellerRegistrationFormValues) => api.post(`/seller/shop/create`, shopData),
  getShopInfo: () => api.get(`/seller/shop/getinformation`),
  getOrders: () => api.get(`/seller/orders`).then(res => res.data.orders).then(data => data.map((order: any) => ({ ...order, total: Number(order.total) }))),
  getOrderDetails: (orderId: number) => api.get(`/seller/orders/${orderId}`).then(res => res.data.order),
};

export default seller;