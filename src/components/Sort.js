import React from "react";
import Pagination from "./Pagination";
import "./Sort.css";

function Sort({
  sortText,
  handleSort,
  itemsPerPage,
  childrenList,
  changePage,
  setItemsPerPage,
  currentPage,
  onPress,
}) {
  return (
    <div>
      <div className="sort__bar">
        <div className="sort__child__search">
          <input
            type="text"
            placeholder="Search for child"
            value={sortText}
            onChange={handleSort}
            className="form-control"
          />
        </div>
        <div className="sort__child__pagination">
          <Pagination
            postsPerPage={itemsPerPage}
            totalItems={childrenList.length}
            changePage={changePage}
            currentPage={currentPage}
          />
        </div>
        <div className="sort__child__dropdown">
          <div className="sort__child__dropdown__label">
            {Number(itemsPerPage * currentPage - itemsPerPage) + 1}-
            {itemsPerPage * currentPage > childrenList.length
              ? childrenList.length
              : itemsPerPage * currentPage}
            {` of ${childrenList.length} `}
          </div>
          <div className="sort__child__dropdown__child">
            <select
              type="number"
              onChange={(num) => {
                setItemsPerPage(num);
              }}
              value={itemsPerPage}
              className="form-select"
            >
              <option>5</option>
              <option>10</option>
              <option>15</option>
              <option>20</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sort;
