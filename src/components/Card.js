import React from "react";
import "./Card.css";

function Card({ data, checkedIn, checkChildOutorIn }) {
  return (
    <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12 " key={data.childId}>
      <div className="child__box">
        <div className="child__box__pic">
          <img src={data.image.small} alt="" />
        </div>
        <div>
          <h4> {data.name.fullName} </h4>
        </div>
        <div>
          <div className="d-grid gap-2 col-12 mx-auto">
            <div className="d-grid gap-2 col-12 mx-auto">
              <p>
                {checkedIn
                  ? `${data.name.firstName} is checked in`
                  : `${data.name.firstName} is not checked in`}
              </p>
              <button
                name={data.childId}
                data-checkedin={data.checkedIn}
                value={data.childId}
                onClick={checkChildOutorIn}
                className={
                  checkedIn
                    ? "btn btn-lg btn-warning"
                    : "btn btn-lg btn-success"
                }
              >
                {checkedIn ? "Check Out" : "Check In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
