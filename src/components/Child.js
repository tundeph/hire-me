import React from "react";
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

  const renderButton = (data) => {
    if (checkedIn.includes(data.childId)) {
      return (
        <div className="d-grid gap-2 col-12 mx-auto">
          <div className="status__alert  green__color">
            {data.name.firstName} is checked in
          </div>
          <button
            name={data.childId}
            value={data.childId}
            onClick={checkChildOutorIn}
            className="btn btn-lg btn-warning"
          >
            Check Out
          </button>
        </div>
      );
    }
    if (checkedOut.includes(data.childId)) {
      return (
        <div className="d-grid gap-2 col-12 mx-auto">
          <div className=" status__alert red__color">
            {data.name.firstName} is not checked in
          </div>
          <button
            name={data.childId}
            value={data.childId}
            onClick={checkChildOutorIn}
            className="btn btn-lg btn-success"
          >
            Check In
          </button>
        </div>
      );
    }
  };

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
                <div>{renderButton(data)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Child;
