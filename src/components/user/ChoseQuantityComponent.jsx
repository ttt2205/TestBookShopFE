import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import "../../assets/scss/componentScss/ChoseQuantity.scss";

const ChoseQuantityComponent = React.memo(
  ({ quantity, productId, handleQuantityChange }) => {
    const [count, setCount] = useState(quantity);

    return (
      <>
        <div
          className="btn-reduce"
          onClick={() =>
            handleQuantityChange("decrement", productId, count, setCount)
          }
        >
          <FaMinus />
        </div>
        <div className="quantity">{count}</div>
        <div
          className="btn-increment"
          onClick={() => {
            handleQuantityChange("increment", productId, count, setCount);
          }}
        >
          <FaPlus />
        </div>
      </>
    );
  }
);

export default ChoseQuantityComponent;
