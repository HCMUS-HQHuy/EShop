import React, { useEffect, useState } from "react";
import Header from "../components/Header.js";
import Rating from "../components/homeComponents/Rating.js";
import { Link, useHistory } from "react-router-dom";
import Message from "../components/LoadingError/Error.js";
import { products } from "../data/Products.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SingleProduct = ({ match }) => {
  const [product, setProduct] = useState({});
  const history = useHistory();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const data = products.filter(
      (product) => product._id === match.params.id
    )?.[0];
    setProduct(data);
  }, [match]);

  const handleAddToCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to add to cart");
      history.push("/login");
      return;
    }

    const existingCart = [...user.cart];
    const productIndex = existingCart.findIndex(
      (item) => item.id === product._id
    );

    if (productIndex !== -1) {
      existingCart[productIndex].quantity += qty;
      toast.info("Product quantity updated in cart");
    } else {
      existingCart.push({ id: product._id, quantity: qty });
      toast.success("Product added to cart");
    }

    const updatedUser = { ...user, cart: existingCart };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <>
      <Header />
      <div className="container single-product">
        <div className="row">
          <div className="col-md-6">
            <div className="single-image">
              <img src={product.image} alt={product.name} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="product-dtl">
              <div className="product-info">
                <div className="product-name">{product.name}</div>
              </div>
              <p>{product.description}</p>

              <div className="product-count col-lg-7 ">
                <div className="flex-box d-flex justify-content-between align-items-center">
                  <h6>Price</h6>
                  <span>${product.price}</span>
                </div>
                <div className="flex-box d-flex justify-content-between align-items-center">
                  <h6>Status</h6>
                  {product.countInStock > 0 ? (
                    <span>In Stock</span>
                  ) : (
                    <span>Unavailable</span>
                  )}
                </div>
                <div className="flex-box d-flex justify-content-between align-items-center">
                  <h6>Reviews</h6>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </div>
                {product.countInStock > 0 ? (
                  <>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Quantity</h6>
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="round-black-btn"
                      onClick={handleAddToCart}
                    >
                      Add To Cart
                    </button>
                    <ToastContainer position="top-right" autoClose={2000} />
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* RATING */}
        <div className="row my-5">
          <div className="col-md-6">
            <h6 className="mb-3">REVIEWS</h6>
            <Message variant={"alert-info mt-3"}>No Reviews</Message>
            <div className="mb-5 mb-md-3 bg-light p-3 shadow-sm rounded">
              <strong>Tien Ho</strong>
              <Rating />
              <span>1 day ago</span>
              <div className="alert alert-info mt-3">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry...
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
