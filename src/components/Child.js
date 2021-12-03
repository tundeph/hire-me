import React from "react";
import Button from "./Button";
import "./Child.css";

function Child({ list, loading, checkChildOutorIn, checkedIn, checkedOut }) {
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
            <div
              className="col-lg-4 col-md-6 col-sm-6 col-xs-12 "
              key={data.childId}
            >
              <div className="child__box">
                <div className="child__box__pic">
                  <img src={data.image.small} alt="" />
                </div>
                <div>
                  <h4> {data.name.fullName} </h4>
                </div>
                <div>
                  <div className="d-grid gap-2 col-12 mx-auto">
                    <Button
                      data={data}
                      checkedIn={checkedIn}
                      checkChildOutorIn={checkChildOutorIn}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Child;
