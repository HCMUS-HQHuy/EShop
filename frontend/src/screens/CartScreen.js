import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link, useHistory } from "react-router-dom";
import { products } from "../data/Products";

const CartScreen = () => {
  const [user, setUser] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      history.push("/login");
      return;
    }
    setUser(storedUser);

    const cartData = storedUser.cart.map((cartItem) => {
      const product = products.find((p) => p._id === cartItem.id);
      return {
        ...product,
        quantity: cartItem.quantity,
        subtotal: cartItem.quantity * product.price,
      };
    });

    setCartProducts(cartData);
  }, [history]);

  const totalItems = cartProducts.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartProducts.reduce((acc, item) => acc + item.subtotal, 0);

  const handleQtyChange = (productId, newQty) => {
    const updatedUser = { ...user };
    const cartItem = updatedUser.cart.find((item) => item.id === productId);
    if (cartItem) {
      cartItem.quantity = parseInt(newQty);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      const updatedCartProducts = updatedUser.cart.map((cartItem) => {
        const product = products.find((p) => p._id === cartItem.id);
        return {
          ...product,
          quantity: cartItem.quantity,
          subtotal: cartItem.quantity * product.price,
        };
      });
      setCartProducts(updatedCartProducts);
    }
  };

  const handleRemove = (productId) => {
    const updatedUser = {
      ...user,
      cart: user.cart.filter((item) => item.id !== productId),
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setCartProducts((prev) => prev.filter((item) => item._id !== productId));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="alert alert-info text-center mt-3">
          Total Cart Products
          <Link className="text-success mx-2" to="/cart">
            ({totalItems})
          </Link>
        </div>

        {cartProducts.length === 0 ? (
          <div className="text-center py-5">Your cart is empty.</div>
        ) : (
          <>
            {cartProducts.map((item) => (
              <div className="cart-iterm row" key={item._id}>
                <div
                  className="remove-button d-flex justify-content-center align-items-center"
                  onClick={() => handleRemove(item._id)}
                  style={{ cursor: "pointer" }}
                >
                  <div>X</div>
                </div>

                <div className="cart-image col-md-3">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-text col-md-5 d-flex align-items-center">
                  <Link to={`/product/${item._id}`}>
                    <h4>{item.name}</h4>
                  </Link>
                </div>

                <div className="cart-qty col-md-2 col-sm-5 mt-md-5 mt-3 mt-md-0 d-flex flex-column justify-content-center">
                  <h6>QUANTITY</h6>
                  <select
                    value={item.quantity}
                    onChange={(e) => handleQtyChange(item._id, e.target.value)}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="cart-price mt-3 mt-md-0 col-md-2 d-flex flex-column justify-content-center align-items-start">
                  <h6>SUBTOTAL</h6>
                  <h4>${item.subtotal}</h4>
                </div>
              </div>
            ))}

            <div className="total mt-4">
              <span className="sub">total:</span>
              <span className="total-price">${totalPrice}</span>
            </div>
            <hr />

            <div className="cart-buttons d-flex align-items-center row">
              <Link to="/" className="col-md-6 ">
                <button>Continue To Shopping</button>
              </Link>
              <div className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0">
                <button onClick={() => history.push("/checkout")}>
                  <Link to="/checkout" className="text-white">
                    Checkout
                  </Link>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartScreen;
