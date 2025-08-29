import api from "./config.api.ts";

const paymentMethods = {
  getAll: () => api.get("user/payment/methods"),
};

export default paymentMethods;