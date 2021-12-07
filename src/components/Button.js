import React from "react";

function Button({ data, checkedIn, checkChildOutorIn }) {
  return (
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
          checkedIn ? "btn btn-lg btn-warning" : "btn btn-lg btn-success"
        }
      >
        {checkedIn ? "Check Out" : "Check In"}
      </button>
    </div>
  );
}

export default Button;
