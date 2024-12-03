import React from "react";
import { BsCart3 } from "react-icons/bs";

function CartEmpty() {
  return (
    <div className="shopping-cart-empty-content">
      <div className="cart-empty">
        <div className="icon-empty-cart">
          <div className="d-flex justify-content-center align-items-center">
            <img src="/asset/images/icon_emptycart.svg" alt="" />
          </div>
          <p className="d-flex justify-content-center align-items-center">
            Chưa có sản phẩm trong giỏ hàng của bạn
          </p>
          <a
            className="btn-buy-now d-flex justify-content-center align-items-center"
            href="/"
          >
            <BsCart3 /> <strong>MUA SẮM NGAY</strong>
          </a>
        </div>
      </div>
    </div>
  );
}

export default CartEmpty;
