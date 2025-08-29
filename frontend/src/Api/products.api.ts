import api from "./config.api.ts";

const product = {
    fetchAll: () => api.get("/user/products/list"),
    getById: (id: number) => api.get(`/user/products/${id}`),
    create: (productData: any) => api.post("/seller/products/add", productData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
    shopFetch: () => api.get("/seller/products/list"),
    shopFetchById: (id: string) => api.get(`/seller/products/${id}`),
    shopUpdateById: (id: string, productData: any) => api.put(`/seller/products/${id}/update`, productData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
    shopDeleteById: (id: string) => api.delete(`/seller/products/${id}/delete`),
};
export default product;