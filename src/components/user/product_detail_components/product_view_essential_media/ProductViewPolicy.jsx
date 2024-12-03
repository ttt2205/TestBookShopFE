import React from "react";
import { FaTruckFast } from "react-icons/fa6";
import { BiSolidPackage } from "react-icons/bi";
import { IoStorefrontSharp } from "react-icons/io5";

function ProductViewPolicy() {
  return (
    <div className="product-view-policy-content">
      <div className="product-view-policy-desktop">
        <div className="product-view-policy-title">
          <strong>Chính sách ưu đãi của Fahasa</strong>
        </div>
        <div className="product-view-policy-attribute">
          <div className="product-view-policy-item">
            <FaTruckFast className="icon-policy" size={20}></FaTruckFast>
            <strong>Thời gian giao hàng: </strong>
            <span>Giao nhanh và uy tín</span>
          </div>
          <div className="product-view-policy-item">
            <BiSolidPackage className="icon-policy" size={20}></BiSolidPackage>
            <strong>Chính sách đổi trả: </strong>
            <span>Đổi trả miễn phí toàn quốc</span>
          </div>
          <div className="product-view-policy-item">
            <IoStorefrontSharp
              className="icon-policy"
              size={20}
            ></IoStorefrontSharp>
            <strong>Chính sách khách sỉ: </strong>
            <span>Ưu đãi khi mua số lượng lớn</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductViewPolicy;
