import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { PayPalButton } from "react-paypal-button-v2";
import { products } from "../data/Products";

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
    const storedOrders = JSON.parse(localStorage.getItem("order")) || [];
    setOrders(storedOrders);
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        {orders.length === 0 ? (
          <p className="text-center mt-4">No orders found.</p>
        ) : (
          orders.map((order, index) => {
            const orderItems = order.cart.map((item) => {
              const product = products.find((p) => p._id === item.id);
              const subtotal = product ? product.price * item.quantity : 0;
              return {
                ...item,
                ...product,
                subtotal,
              };
            });

            const productsTotal = orderItems.reduce(
              (acc, cur) => acc + cur.subtotal,
              0
            );
            const shipping = 5;
            const tax = 2;
            const total = productsTotal + shipping + tax;

            return (
              <div key={index} className="mb-5 border p-4 rounded shadow-sm">
                <div className="row order-detail mb-4">
                  <div className="col-lg-4 col-sm-4 mb-3">
                    <div className="row">
                      <div className="col-md-4 center">
                        <div className="alert-success order-box">
                          <i className="fas fa-user"></i>
                        </div>
                      </div>
                      <div className="col-md-8 center">
                        <h5>
                          <strong>Customer</strong>
                        </h5>
                        <p>{order.shipping.fullName}</p>
                        <div className="bg-success p-1 col-12">
                          <p className="text-white text-center text-sm-start">
                            Paid
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-4 mb-3">
                    <div className="row">
                      <div className="col-md-4 center">
                        <div className="alert-success order-box">
                          <i className="fas fa-truck-moving"></i>
                        </div>
                      </div>
                      <div className="col-md-8 center">
                        <h5>
                          <strong>Order info</strong>
                        </h5>
                        <p>Shipping: {order.shipping.city}</p>
                        <p>
                          Pay method: Card ending{" "}
                          {order.payment.cardNumber.slice(-4)}
                        </p>
                        <div className="bg-info p-2 col-12">
                          <p className="text-white text-center text-sm-start">
                            Order at{" "}
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-sm-4 mb-3">
                    <div className="row">
                      <div className="col-md-4 center">
                        <div className="alert-success order-box">
                          <i className="fas fa-map-marker-alt"></i>
                        </div>
                      </div>
                      <div className="col-md-8 center">
                        <h5>
                          <strong>Deliver to</strong>
                        </h5>
                        <p>
                          {order.shipping.address}, {order.shipping.city},{" "}
                          {order.shipping.postalCode}
                        </p>
                        <div className="bg-warning p-1 col-12">
                          <p className="text-white text-center text-sm-start">
                            Being Delivered
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row order-products justify-content-between">
                  <div className="col-lg-8">
                    {orderItems.map((item, i) => (
                      <div key={i} className="order-product row mb-3">
                        <div className="col-md-3 col-6">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid"
                          />
                        </div>
                        <div className="col-md-5 col-6 d-flex align-items-center">
                          <Link to={`/`}>
                            <h6>{item.name}</h6>
                          </Link>
                        </div>
                        <div className="mt-3 mt-md-0 col-6 col-md-2 d-flex align-items-center flex-column justify-content-center">
                          <h6>QUANTITY</h6>
                          <p>{item.quantity}</p>
                        </div>
                        <div className="mt-3 mt-md-0 col-md-2 col-6 d-flex align-items-end flex-column justify-content-center">
                          <h6>SUBTOTAL</h6>
                          <p>${item.subtotal.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="col-lg-3 d-flex align-items-end flex-column mt-5 subtotal-order">
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Products</strong>
                          </td>
                          <td>${productsTotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Shipping</strong>
                          </td>
                          <td>${shipping.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Tax</strong>
                          </td>
                          <td>${tax.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Total</strong>
                          </td>
                          <td>${total.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="col-12"></div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default OrderScreen;
