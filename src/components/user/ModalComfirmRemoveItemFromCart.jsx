import React, { useEffect } from "react";
import { FaRegTrashCan } from "react-icons/fa6";

function ModalComfirmRemoveItemFromCart({
  productId,
  productTitle,
  handleRemoveItemFromCart,
}) {
  useEffect(() => {
    console.log("Product updated:", productId, productTitle);
  }, [productId, productTitle]); // Cập nhật khi props thay đổi

  return (
    <>
      {/* <!-- Button trigger modal --> */}
      <button
        type="button"
        className="btn"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal-${productId}`}
      >
        <FaRegTrashCan></FaRegTrashCan>
      </button>
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`exampleModal-${productId}`}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`exampleModalLabel-${productId}`}>
                Modal title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Do you want to remove {productTitle} ?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => {
                  handleRemoveItemFromCart(productId);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalComfirmRemoveItemFromCart;
