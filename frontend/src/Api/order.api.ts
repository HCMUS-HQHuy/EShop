import api from "./config.api.ts";

const order = {
    create: (orderData: any) => api.post('user/orders/create', orderData),
};

export default order;