import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACK_END_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const product = {
    fetchAll: () => api.get("/user/products/list"),
    create: (productData: any) => api.post("/seller/products/add", productData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
    shopFetch: () => api.get("/seller/products/list"),
};
export default product;