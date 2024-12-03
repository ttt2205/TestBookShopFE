import React from "react";
import { CiStar } from "react-icons/ci";

function ProductInfo({ productInfo }) {
  // Hàm định dạng tiền tệ Việt Nam
  function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  return (
    <div className="product-infor-content">
      <div className="name-product">
        <h4>{productInfo.title}</h4>
      </div>
      <div className="suplier-and-author">
        <div className="suplier">
          <p>
            Suplier:<strong>{productInfo.publisher || "N/A"}</strong>
          </p>
        </div>
        <div className="author">
          <p>
            Author:
            <strong>
              {productInfo.author?.map((item, index) => (
                <span>
                  {index !== productInfo.author.length - 1
                    ? `${item}-`
                    : `${item}`}
                </span>
              )) || "N/A"}
            </strong>
          </p>
        </div>
      </div>
      <div className="publisher">
        <p>
          Publisher: <strong>{productInfo.publisher || "N/A"}</strong>
        </p>
      </div>
      <div className="vote-and-sale">
        <div className="vote">
          <CiStar className="far fa-star rating-color" size={20}></CiStar>
          <CiStar className="far fa-star rating-color" size={20}></CiStar>
          <CiStar className="far fa-star rating-color" size={20}></CiStar>
          <CiStar className="far fa-star rating-color" size={20}></CiStar>
          <CiStar className="far fa-star rating-color" size={20}></CiStar>
        </div>
        <div className="sale">
          <p>|</p>
          <span className="pt-1" style={{ fontSize: "14px" }}>
            (0 lượt đánh giá)
          </span>
        </div>
      </div>
      <div className="price-and-discount">
        <div className="price-discount">
          <h2>
            {productInfo.discountValue > 0
              ? formatCurrencyVND(
                  Math.round(
                    parseFloat(productInfo.salePrice, 10) *
                      (100 - parseFloat(productInfo.discountValue, 10))
                  ) / 100
                )
              : formatCurrencyVND(
                  Math.round(parseFloat(productInfo.salePrice, 10))
                )}
            &nbsp;
          </h2>
        </div>
        <div className="price-product">
          {productInfo.discountValue > 0 ? (
            <p id="price">
              {formatCurrencyVND(productInfo.salePrice)}
              &nbsp;
            </p>
          ) : null}
        </div>
        {productInfo.discountValue > 0 ? (
          <div className="discount d-flex align-items-center p-1">
            <p id="discountValue" className="m-0">
              <strong>-{productInfo.discountValue}%</strong>
            </p>
          </div>
        ) : null}
      </div>

      {productInfo.stock > 0 ? (
        <></>
      ) : (
        <div className="out-of-stock">
          <p>Product temporarily out of stock</p>
        </div>
      )}
    </div>
  );
}

export default ProductInfo;
