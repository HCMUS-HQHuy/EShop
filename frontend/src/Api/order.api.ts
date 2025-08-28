import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


const order = {
    create: (orderData: any) => api.post('user/orders/create', orderData),
};

export default order;