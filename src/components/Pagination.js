import React from "react";
import "./Pagination.css";

function Pagination({ postsPerPage, totalItems, changePage }) {
  const numberOfPages = Math.ceil(totalItems / postsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= numberOfPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="btn__container">
      {pageNumbers.map((num) => {
        return (
          <div key={num}>
            <button
              key={num}
              onClick={() => {
                changePage(num);
              }}
              className="btn btn-outline-secondary"
            >
              <span>{num}</span> {console.log("paginate")}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Pagination;
