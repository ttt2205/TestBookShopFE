import React from "react";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";

const ChooseQuantity = React.memo(({ count, handleQuantity }) => {
  return (
    <>
      <div className="btn-reduce" onClick={() => handleQuantity("decrement")}>
        <FaMinus />
      </div>
      <div className="quantity">{count}</div>
      <div
        className="btn-increment"
        onClick={() => {
          handleQuantity("increment");
        }}
      >
        <FaPlus />
      </div>
    </>
  );
});

export default ChooseQuantity;
