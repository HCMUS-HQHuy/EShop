import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./style.css";
import { products } from "../data/Products";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const Header = () => {
  const history = useHistory();
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  const pathname = location.pathname;

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    history.push("/login");
  };

  const updateCartCount = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.cart) {
      const total = user.cart.reduce((acc, item) => acc + 1, 0);
      setCartCount(total);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(filtered);
  };

  const handleProductClick = (id) => {
    history.push(`/products/${id}`);
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div>
      {/* Top Header */}
      <div className="Announcement">
        <div className="container">
          <div
            className="d-flex"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="col-md-6 d-flex align-items-center display-none">
              <p>Support 24/7: 0868694377</p>
            </div>
            <p style={{ fontSize: "15px", color: "white" }}>
              Email: dangtienqqqq@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      {!pathname.includes("/login") && (
        <div className="header">
          <div className="container">
            <div className="pc-header">
              <div className="row">
                <div className="col-md-3 col-4 d-flex align-items-center">
                  <Link className="navbar-brand" to="/">
                    <img alt="logo" src="/images/logo.png" />
                  </Link>
                </div>

                <div className="col-md-6 col-8 d-flex align-items-center position-relative">
                  <input
                    type="search"
                    className="form-control rounded search"
                    placeholder="Search products"
                    value={searchTerm}
                    onChange={handleInputChange}
                  />

                  {searchTerm && (
                    <div
                      className="search-result-box bg-white p-2 shadow rounded position-absolute w-100"
                      style={{ zIndex: 1000, top: "60%", width: "90%" }}
                    >
                      {searchResults.length > 0 ? (
                        searchResults.map((product) => (
                          <div
                            key={product._id}
                            onClick={() => handleProductClick(product._id)}
                            style={{ cursor: "pointer", padding: "5px 0" }}
                            className="search-result-item"
                          >
                            <img
                              src={product.image}
                              alt=""
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                              }}
                            />
                            <strong>{product.name}</strong> - ${product.price}
                          </div>
                        ))
                      ) : (
                        <div>Product not found</div>
                      )}
                    </div>
                  )}
                </div>

                {user && (
                  <div className="col-md-3 d-flex align-items-center justify-content-end Login-Register">
                    <div className="btn-group">
                      <button
                        type="button"
                        className="name-button dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Hi, {user.fullName}
                      </button>
                      <div className="dropdown-menu">
                        <div
                          className="dropdown-item dropdown-header"
                          onClick={handleLogout}
                        >
                          Logout
                        </div>
                      </div>
                    </div>
                    <Link to="/cart">
                      <i className="fas fa-shopping-bag"></i>
                      <span className="badge">{cartCount}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
