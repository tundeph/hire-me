import React from "react";
import "./Pagination.css";

function Pagination({ postsPerPage, totalItems, changePage, currentPage }) {
  const numberOfPages = Math.ceil(totalItems / postsPerPage);

  let disableNext = "";
  let disablePrev = "";
  if (currentPage === Number(numberOfPages)) {
    disableNext = "disabled";
  }
  if (currentPage === 1) {
    disablePrev = "disabled";
  }

  return (
    <div className="btn__container">
      <button
        onClick={(e) => {
          changePage(currentPage - 1);
        }}
        className="btn btn-outline-secondary"
        disabled={disablePrev}
      >
        <span> Prev. </span>
      </button>

      <button
        onClick={(e) => {
          changePage(currentPage + 1);
        }}
        className="btn btn-outline-secondary"
        disabled={disableNext}
      >
        <span> Next </span>
      </button>
    </div>
  );
}

export default Pagination;
