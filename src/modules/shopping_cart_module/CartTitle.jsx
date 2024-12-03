import React from "react";

function CartTitle({ quantityProductChosen }) {
  return (
    <div className="cart-title-content">
      <h4>GIỎ HÀNG</h4>
      <p>({quantityProductChosen} sản phẩm)</p>
    </div>
  );
}

export default CartTitle;
