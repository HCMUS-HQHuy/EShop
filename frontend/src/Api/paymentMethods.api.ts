import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const paymentMethods = {
  getAll: () => api.get("user/payment/methods"),
};

export default paymentMethods;