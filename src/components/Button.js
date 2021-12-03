import React from "react";

function Button({ data, checkedIn, checkChildOutorIn }) {
  return (
    <div className="d-grid gap-2 col-12 mx-auto">
      <p>
        {checkedIn.includes(data.childId)
          ? `${data.name.firstName} is checked in`
          : `${data.name.firstName} is not checked in`}
      </p>
      <button
        name={data.childId}
        value={data.childId}
        onClick={checkChildOutorIn}
        className={
          checkedIn.includes(data.childId)
            ? "btn btn-lg btn-warning"
            : "btn btn-lg btn-success"
        }
      >
        {checkedIn.includes(data.childId) ? "Check Out" : "Check In"}
      </button>
    </div>
  );
}

export default Button;
