import React, { useState } from "react";

const DateRangePicker = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  className,
}) => {
  return (
    <>
      <div className={className}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="form-control"
        />
      </div>
      <div className={className}>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="form-control"
        />
      </div>
    </>
  );
};

export default DateRangePicker;
