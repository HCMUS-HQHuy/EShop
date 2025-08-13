import order from "services/order.services";
import socket from "./socket.services";
import payment from "./payment.services"
const services = {
    order,
    socket,
    payment
};

export default services;
