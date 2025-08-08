import React from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  if (totalPages <= 1) return null;

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pages = [...Array(totalPages).keys()].map((x) => x + 1);

  return (
    <nav className="mt-4">
      <ul className="pagination justify-content-center">
        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => handleClick(page)}>
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
