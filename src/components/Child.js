import React from "react";
import "./Child.css";

function Child({ list, loading, checkChildOutorIn, checkedIn, checkedOut }) {
  if (loading) {
    return <h4>Loading... </h4>;
  }

  const renderButton = (data) => {
    if (checkedIn.includes(data.childId)) {
      return (
        <div className="d-grid gap-2 col-12 mx-auto">
          <div className="alert alert-light green__color" role="alert">
            {data.name.fullName} checked in successfully
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
          <div className="alert alert-light red__color" role="alert">
            {data.name.fullName} is not checked in
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
                  <img src={data.image.large} alt="" />
                </div>
                <div>
                  <h3> {data.name.fullName} </h3>
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
