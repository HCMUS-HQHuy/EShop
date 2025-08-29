import order from "services/order.services";
import socket from "./socket.services";
import payment from "./payment.services"
import email from "./email.services"
import cronJobs from "./cronJob.services"

const services = {
    order,
    socket,
    payment,
    email,
    cronJobs
};

export default services;
