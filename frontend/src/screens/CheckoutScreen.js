import React, { useState } from "react";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const CheckoutScreen = () => {
  const history = useHistory();
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [payment, setPayment] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const handlePaymentChange = (e) => {
    if (e.target.name === "cardNumber") {
      const formattedCardNumber = formatCardNumber(e.target.value);
      setPayment({ ...payment, cardNumber: formattedCardNumber });
    } else {
      setPayment({ ...payment, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to place an order");
      return;
    }

    const newOrder = {
      userId: user.id,
      shipping,
      payment,
      cart: user.cart || [],
      createdAt: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem("order")) || [];
    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem("order", JSON.stringify(updatedOrders));

    const updatedUser = { ...user, cart: [] };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    window.dispatchEvent(new Event("cartUpdated"));

    toast.success("Order placed successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setShipping({
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
    });
    setPayment({
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    });
    setCheckoutDone(true);
  };

  return (
    <>
      <Header />
      <div className="container my-4">
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "2rem" }}>
            <div style={{ flex: 1 }}>
              <h4>Shipping Address</h4>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  name="fullName"
                  value={shipping.fullName}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={shipping.address}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  value={shipping.city}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="postalCode" className="form-label">
                  Postal Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="postalCode"
                  name="postalCode"
                  value={shipping.postalCode}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={shipping.phone}
                  onChange={handleShippingChange}
                  required
                />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h4>Payment Information</h4>
              <div className="mb-3">
                <label htmlFor="cardName" className="form-label">
                  Name on Card
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cardName"
                  name="cardName"
                  value={payment.cardName}
                  onChange={handlePaymentChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="cardNumber" className="form-label">
                  Card Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cardNumber"
                  name="cardNumber"
                  value={payment.cardNumber}
                  onChange={handlePaymentChange}
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  required
                  pattern="(\d{4} ){3}\d{4}"
                  title="Enter a valid 16-digit card number, grouped in 4 digits separated by spaces"
                />
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label htmlFor="expiryDate" className="form-label">
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="expiryDate"
                    name="expiryDate"
                    value={payment.expiryDate}
                    onChange={handlePaymentChange}
                    required
                  />
                </div>
                <div className="col-6 mb-3">
                  <label htmlFor="cvv" className="form-label">
                    CVV
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="cvv"
                    name="cvv"
                    value={payment.cvv}
                    onChange={handlePaymentChange}
                    maxLength={3}
                    pattern="\d{3}"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-4">
            Place Order
          </button>
          {checkoutDone && (
            <button
              className="btn btn-primary mt-4 ms-4"
              onClick={() => history.push("/order")}
            >
              View Order
            </button>
          )}
        </form>
      </div>

      <ToastContainer />
    </>
  );
};

export default CheckoutScreen;
