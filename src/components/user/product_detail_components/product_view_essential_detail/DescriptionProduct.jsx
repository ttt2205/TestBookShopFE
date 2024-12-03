import React from "react";

function DescriptionProduct({ descriptionProduct }) {
  return (
    <div className="description-product-content">
      <div className="title">
        <strong>Mô tả sản phẩm</strong>
      </div>
      <div id="product_tabs_description_content">
        <div id="desc_content">
          <p className="text-start text-break">
            <strong>{descriptionProduct.title}</strong>
          </p>
          <p className="text-start text-break">
            <em>
              <strong>{descriptionProduct.title}</strong>
            </em>
          </p>
          <p className="text-start text-break lh-base ">
            {descriptionProduct.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DescriptionProduct;
