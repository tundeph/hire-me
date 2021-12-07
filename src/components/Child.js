import React from "react";
import Card from "./Card";
import "./Child.css";

function Child({ list, loading, checkChildOutorIn }) {
  //while the server is being called
  if (loading) {
    return (
      <div className="child__container">
        <h5>Loading... </h5>
      </div>
    );
  }

  //if the server returns an error and there is no child list
  if ((!loading && list.length === 0) || list.length === 0) {
    return (
      <div className="child__container">
        <h5>Oops! No child found! </h5>
      </div>
    );
  }

  return (
    <div className="child__container container">
      <div className="row g-4">
        {list.map((data) => {
          return (
            <Card
              key={data.childId}
              data={data}
              checkedIn={data.checkedIn}
              checkChildOutorIn={checkChildOutorIn}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Child;
