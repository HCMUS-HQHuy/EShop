import React, { useState } from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import Pagination from "./pagination";
import { products } from "../../data/Products";

const ShopSection = () => {
  const productsItems = products.filter((product) => product.countInStock > 0);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = productsItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(productsItems.length / itemsPerPage);

  return (
    <div className="container">
      <div className="section">
        <div className="row">
          <div className="col-lg-12 col-md-12 article">
            <div className="shopcontainer row">
              {currentProducts.map((product) => (
                <div
                  className="shop col-lg-4 col-md-6 col-sm-6"
                  key={product._id}
                >
                  <div className="border-product">
                    <Link to={`/products/${product._id}`}>
                      <div className="shopBack">
                        <img src={product.image} alt={product.name} />
                      </div>
                    </Link>
                    <div className="shoptext">
                      <p>
                        <Link to={`/products/${product._id}`}>
                          {product.name}
                        </Link>
                      </p>
                      <Rating
                        value={product.rating}
                        text={`${product.numReviews} reviews`}
                      />
                      <h3>${product.price}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSection;
