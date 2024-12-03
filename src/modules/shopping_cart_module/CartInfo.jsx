import React, { useEffect, useState, useRef } from "react";
import {
  ChoseQuantityComponent,
  ModalComfirmRemoveItemFromCart,
} from "../../components/user";
import { BiSolidDiscount } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";
import ModalNotice from "./ModalNotice";
import { useNavigate } from "react-router-dom";
import { insertOrder } from "../../services/cartService";

function CartInfo({
  quantityProductChosen,
  cartProducts,
  refreshKey,
  handleRefreshKey,
  formatCurrencyVND,
  handleChangeTotal,
  promotions,
  promotionCurrent,
  setPromotionCurrent,
  promotionIsEligible,
  total,
  totalPromotion,
}) {
  // Tạo một ref để tham chiếu đến container khuyến mãi
  const detailPromotionContainerRef = useRef(null);
  const modalThongBaoDangNhap = useRef(null);
  const [checkBoxes, setCheckBoxes] = useState({
    selectAll: false,
    items: cartProducts.reduce((acc, item) => {
      acc[item.productID] = false;
      return acc;
    }, {}),
  });
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [emailCustomer, setEmailCustomer] = useState("");

  // Cập nhật email người dùng
  useEffect(() => {
    try {
      if (user.email) {
        setEmailCustomer(user.email);
      }
    } catch (error) {
      console.log(
        ">>> Khong the lay email cua khach hang trong CartInfo.jsx",
        "\nError",
        error
      );
    }
  }, [user]);

  // Thay đổi total khi chọn sản phẩm thay đổi
  useEffect(() => {
    handleTotal(); // This will recalculate the total whenever the `checkBoxes` state changes
  }, [checkBoxes, refreshKey]);

  const handleQuantityChange = (type, productId, count, setCount) => {
    if (type === "increment") {
      const newQuantity = handleQuantityCartItem(productId, 1);
      setCount(newQuantity); // Cập nhật count với giá trị mới
    } else if (type === "decrement") {
      if (count > 1) {
        const newQuantity = handleQuantityCartItem(productId, -1);
        setCount(newQuantity); // Trả về số lượng đã giảm
      }
    }
    // Tăng refreshKey để component tái render
    handleRefreshKey();
  };

  // Thay đổi quantity của product trong localStorage
  const handleQuantityCartItem = (productId, quantity) => {
    // Lấy giỏ hàng từ localStorage (nếu chưa có thì tạo mảng rỗng)
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa
    const existingProduct = cart.find((item) => item.productID === productId);

    if (existingProduct) {
      const newQuantity = existingProduct.quantity + quantity;
      if (newQuantity > existingProduct.stockQuantity) {
        alert("Hiện tại không đủ hàng cho số lượng " + newQuantity);
        return existingProduct.quantity;
      }
      // Nếu sản phẩm đã có, tăng số lượng
      existingProduct.quantity = newQuantity;
      existingProduct.total = newQuantity * existingProduct.salePrice;
    }
    // Lưu giỏ hàng mới vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    return existingProduct.quantity;
  };

  // Bỏ product khỏi localStorage
  const handleRemoveItemFromCart = (productId) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => item.productID !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));

    // If the cart is empty, ensure checkboxes reset and selectAll is set to false
    if (cart.length === 0) {
      setCheckBoxes({
        selectAll: false,
        items: {},
      });
    }
    // Thay đổi checkbox khi xóa item khỏi cartProduct
    updateCheckBoxWhenItemIsRemoved(productId);
    handleRefreshKey();
  };

  // Hàm thay đổi checkbox khi xóa item khỏi cartProduct
  const updateCheckBoxWhenItemIsRemoved = (productId) => {
    // Sao chép sâu checkBoxes
    let newCheckBox = { ...checkBoxes };
    // Xóa sản phẩm khỏi `items` bằng cách dùng delete
    delete newCheckBox.items[productId];
    // Cập nhật lại trạng thái checkBoxes
    setCheckBoxes({
      selectAll: checkBoxes.selectAll,
      items: newCheckBox.items,
    });
  };

  // Hàm đóng detail promotion
  const closeDetailPromotion = () => {
    if (detailPromotionContainerRef.current) {
      // Kiểm tra xem phần tử có lớp "d-none" hay chưa
      if (detailPromotionContainerRef.current.classList.contains("d-none")) {
        detailPromotionContainerRef.current.classList.remove("d-none");
      } else {
        detailPromotionContainerRef.current.classList.add("d-none");
      }
    }
  };

  // Hàm xử lý progress đủ điều kiện với mỗi promotion
  const handleProgress = (conditional, total) => {
    if (conditional - total < 0) return 100;
    else return Math.round((total / conditional) * 100);
  };

  // Hàm tính total khi chọn sản phẩm
  const handleTotal = () => {
    const bookIsCheckBox = checkCheckBoxIsChecked();

    const newTotal = cartProducts.reduce((totalPrice, key) => {
      if (bookIsCheckBox.includes(key.productID)) {
        return totalPrice + key.total;
      }
      return totalPrice;
    }, 0);

    handleChangeTotal(newTotal);
  };

  // Hàm kiểm tra số sản phảm được chọn
  const checkCheckBoxIsChecked = () => {
    const checkedInput = Object.entries(checkBoxes.items)
      .filter((item) => item[1] === true)
      .map((item) => item[0]);
    return checkedInput;
  };

  // Hàm xử lý chọn checkbox All
  const handlsSelectAllChange = () => {
    const newSelectAll = !checkBoxes.selectAll;
    const newItems = Object.keys(checkBoxes.items).reduce((acc, key) => {
      acc[key] = newSelectAll;
      return acc;
    }, {});
    setCheckBoxes({
      selectAll: newSelectAll,
      items: newItems,
    });
  };

  // Hàm xử lý chọn từng checkbox của product
  const handleItemChange = (item) => {
    const newItems = {
      ...checkBoxes.items,
      [item]: !checkBoxes.items[item],
    };

    // Check if all items are selected to update selectAll state
    const newSelectAll = Object.values(newItems).every((value) => value);
    setCheckBoxes({
      selectAll: newSelectAll,
      items: newItems,
    });
  };

  // Hàm xử lý thanh toán
  const handleOpenModal = (e) => {
    if (modalThongBaoDangNhap.current) {
      // Kiểm tra xem phần tử có lớp "d-none" hay chưa
      if (modalThongBaoDangNhap.current.classList.contains("d-none")) {
        modalThongBaoDangNhap.current.classList.remove("d-none");
      } else {
        modalThongBaoDangNhap.current.classList.add("d-none");
      }
    }
  };

  // Hàm điều hướng tới trang login khi chưa đăng nhập
  const handleLoginUser = () => {
    navigate("/user-login");
  };

  // Thực hiện xác nhận thanh toán
  const handleConfirmPayment = async () => {
    try {
      console.log(">>> emailCustomer", emailCustomer);
      let addressIsChose = localStorage.getItem("addressIsChose");
      const orders = {
        email: emailCustomer || "",
        order: {
          user_id: "",
          total_amount: totalPromotion,
          status_id: 1,
          address: addressIsChose,
          billPromotion_id: null,
        },
        orderDetails: [],
      };

      // Kiểm tra khi có sản phẩm được chọn để thanh toán không
      let flag = false;
      Object.values(checkBoxes.items).forEach((checkBox) => {
        if (checkBox === true) flag = true;
      });
      if (!flag) {
        alert("Vui lòng chọn sản phẩm");
        handleOpenModal(null);
        return;
      }

      // Kiểm tra promotion client chọn có đủ điều kiện
      if (promotionCurrent.isEligible) {
        orders.order.billPromotion_id = promotionCurrent.billPromotion_id;
      }

      // Mảng các item cần xóa
      let itemIsRemoved = [];

      if (checkBoxes.selectAll) {
        // Kiểm tra xem có chọn tất cả sản phẩm
        let orderDetail = {};
        cartProducts.forEach((item) => {
          orderDetail = {
            order_id: null,
            book_id: item.productID,
            quantity: item.quantity,
            price: item.salePrice,
            discount_id: item.discountId,
          };
          orders.orderDetails.push(orderDetail);
          itemIsRemoved.push(item.productID);
        });
      } else {
        const checkboxIsChosen = Object.entries(checkBoxes.items)
          .filter((item) => item[1])
          .map((item) => item[0]); // trả về mảng chưa các productId được chọn
        // Thêm các sản phẩm đã chọn
        let orderDetail = {};
        cartProducts.forEach((item) => {
          if (checkboxIsChosen.includes(item.productID)) {
            orderDetail = {
              book_id: item.productID,
              quantity: item.quantity,
              price: item.salePrice,
              discount_id: item.discountId,
            };
            orders.orderDetails.push(orderDetail);
            itemIsRemoved.push(item.productID);
          }
        });
      }
      const respone = await insertOrder(orders);
      itemIsRemoved.forEach((item) => {
        handleRemoveItemFromCart(item);
      });
      handleOpenModal();
      alert("Đặt hàng thành công");
    } catch (error) {
      console.log(">>> Error handleConfirmPayment", error);
    }
  };

  return (
    <div className="cart-info-content row">
      {/* product-of-cart-info-container */}
      <div className="col-lg-8 col-sm-12 product-of-cart-info-container">
        <div className="product-of-cart-info-content">
          {/* header cart item */}
          <div className="header-cart-item-container rounded-1 pt-2 pb-2">
            <div className="header-cart-item-content d-flex flex-column align-items-center rounded-1">
              <div className="header-cart-item row w-100">
                <div className="col-1 d-flex justify-content-center align-items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    checked={checkBoxes.selectAll}
                    onChange={() => {
                      handlsSelectAllChange();
                    }}
                    style={{
                      width: "15px",
                      height: "15px",
                      transform: "scale(1.5)", // Tăng kích thước nếu muốn
                    }}
                  />
                </div>
                <p className="col-6 p-0 m-0 ">
                  Chọn tất cả ({quantityProductChosen} sản phẩm)
                </p>
                <p className="col-2 text-center p-0 m-0 ">Số lượng</p>
                <p className="col-2 text-center p-0 m-0 ">Thành tiền</p>
                <div className="col-1 p-0 m-0"></div>
              </div>
            </div>
          </div>
          {/* product-cart-items */}
          <div className="product-cart-container-left rounded-1">
            {/* Nội dung của sản phẩm hoặc thông tin khác */}
            <div className="product-cart-content-left d-flex flex-column align-items-center rounded-1">
              {/* Items */}
              {cartProducts ? (
                cartProducts.map((cartItem) => (
                  <div className="product-cart-item row w-100">
                    <div className="col-1 d-flex justify-content-center align-items-center">
                      <input
                        id={cartItem.productID}
                        type="checkbox"
                        checked={checkBoxes.items[cartItem.productID]}
                        onChange={() => {
                          handleItemChange(cartItem.productID);
                        }}
                        style={{
                          width: "15px",
                          height: "15px",
                          transform: "scale(1.5)", // Tăng kích thước nếu muốn
                        }}
                      />
                    </div>
                    <div className="col-6 p-0 m-0 d-flex align-items-center ">
                      <div className="product-item d-flex flex-row w-100 h-100 row">
                        <div className="col-4 item-img">
                          <img src={cartItem.imageMain} alt="" />
                        </div>
                        <div className="item-info col-8">
                          <p className="item-name">{cartItem.title}</p>
                          <div className="item-price d-flex flex-row">
                            {cartItem.discountValue !== 0 ? (
                              <>
                                <p style={{ marginRight: "10px" }}>
                                  <strong>
                                    {formatCurrencyVND(
                                      (cartItem.salePrice *
                                        (100 - cartItem.discountValue)) /
                                        100
                                    )}
                                  </strong>
                                </p>
                                <p style={{ textDecoration: "line-through" }}>
                                  {formatCurrencyVND(cartItem.salePrice)}
                                </p>
                              </>
                            ) : (
                              <>
                                <p style={{ marginRight: "10px" }}>
                                  <strong>
                                    {formatCurrencyVND(cartItem.salePrice)}
                                  </strong>
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-2 text-center d-flex align-items-center justify-content-center ">
                      <ChoseQuantityComponent
                        quantity={cartItem.quantity}
                        productId={cartItem.productID}
                        handleQuantityChange={handleQuantityChange}
                      />
                    </div>
                    <div className="col-2 text-center d-flex align-items-center justify-content-center ">
                      {formatCurrencyVND(cartItem.total)}
                    </div>
                    <div className="col-1 p-0 m-0 d-flex align-items-center  justify-content-center">
                      <ModalComfirmRemoveItemFromCart
                        productId={cartItem.productID}
                        productTitle={cartItem.title}
                        handleRemoveItemFromCart={handleRemoveItemFromCart}
                      ></ModalComfirmRemoveItemFromCart>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* total-amount */}
      <div className="col-lg-4 hidden-max-width-992px d-none d-lg-block total-right-container">
        <div className="total-right-content">
          {promotions.length > 0 ? (
            <div className="promotion-right-container mb-2">
              <div className="promotion-right-content">
                <div className="promotion-title row text-primary pt-2">
                  <div className="col-6 d-flex align-items-center">
                    <BiSolidDiscount />
                    &nbsp;&nbsp;KHUYẾN MÃI
                  </div>
                  <div
                    className="col-6 d-flex align-items-center justify-content-end"
                    onClick={closeDetailPromotion}
                    style={{ cursor: "pointer" }}
                  >
                    Xem&nbsp;thêm&nbsp;&nbsp;&gt;
                  </div>
                </div>
                <hr />
                <div className="promotion-content">
                  <div className="row">
                    <p className="col-8">{promotionCurrent.promotion_name}</p>
                    <p className="col-4 d-flex justify-content-end text-primary text-decoration-underline">
                      Chi tiết
                    </p>
                  </div>
                  <p className="fs-6 fw-light text-break">
                    Đơn hàng từ{" "}
                    {formatCurrencyVND(promotionCurrent.conditional)} - Xem chi
                    tiết để biết thêm về thể lệ chương trình
                  </p>
                  <div className="row">
                    <div className="col-8">
                      <div
                        className="progress progress-sm"
                        style={{ height: "0.5rem" }}
                      >
                        <div
                          className="progress-bar progress-height-0.5"
                          style={{
                            width: `${handleProgress(
                              promotionCurrent.conditional,
                              total
                            )}%`,
                            height: "0.5rem",
                          }}
                          role="progressbar"
                          aria-valuenow={`${handleProgress(
                            promotionCurrent.conditional,
                            total
                          )}%`}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <p
                        className="fw-light text-break"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Mua thêm{" "}
                        {promotionCurrent.conditional - total > 0
                          ? formatCurrencyVND(
                              promotionCurrent.conditional - total
                            )
                          : 0}{" "}
                        để nhận mã
                      </p>
                    </div>
                    <div className="col-4 m-0 p-0">
                      <a
                        className="btn btn-primary m-0"
                        style={{
                          width: "80%",
                          fontSize: "0.8rem",
                          wordWrap: "break-word",
                        }}
                        href="/"
                        role="button"
                      >
                        Mua&nbsp;thêm
                      </a>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="promotion-matched">
                  <div className="quantity-matched row text-primary m-0">
                    <p
                      className="col-10 pl-2 m-0 d-flex align-items-center"
                      style={{ backgroundColor: "rgba(173, 216, 230, 0.7)" }}
                    >
                      &nbsp;&nbsp;{promotionIsEligible} khuyến mãi đủ điều kiện
                    </p>
                    <p
                      className="col-2 m-0 d-flex align-items-center justify-content-end"
                      style={{ backgroundColor: "rgba(173, 216, 230, 0.7)" }}
                    >
                      &gt;
                    </p>
                  </div>
                  <p
                    className="fw-light"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "0.8rem",
                    }}
                  >
                    Áp dụng khuyến mãi khi đủ điều kiện
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="payment-right-container mb-2">
            <div className="payment-right-content">
              <div className="payment-title row pt-2">
                <div className="col-6 d-flex align-items-center">
                  &nbsp;&nbsp;Thành tiền
                </div>
                <div className="col-6 d-flex align-items-center justify-content-end">
                  {formatCurrencyVND(total)}
                </div>
              </div>
              <hr />
              <div className="payment-content">
                <div className="payment-price row pt-2">
                  <div className="col-8 d-flex align-items-center">
                    &nbsp;&nbsp;Tổng Số Tiền (Đã Giảm)
                  </div>
                  <div className="col-4 d-flex align-items-center justify-content-end fs-5 text-danger">
                    <strong>{formatCurrencyVND(totalPromotion)}</strong>
                  </div>
                </div>
                {/* Button Thanh Toan */}
                <button
                  type="button"
                  class="btn btn-danger w-100 mt-2 fs-5"
                  onClick={handleOpenModal}
                >
                  <strong>Thanh Toán</strong>
                </button>
                {/* THONG BAO CHO NGUOI DUNG DANG NHAP */}
                {!user ? (
                  <ModalNotice
                    header={"Vui lòng đăng nhập"}
                    content={"Vui lòng đăng nhập để thanh toán!"}
                    btnAction={"Đăng nhập"}
                    handleAction={handleLoginUser}
                    ref={modalThongBaoDangNhap}
                  />
                ) : (
                  <ModalNotice
                    header={"Thanh Toán"}
                    content={"Xác nhận thanh toán!"}
                    btnAction={"Xác nhận"}
                    handleAction={handleConfirmPayment}
                    ref={modalThongBaoDangNhap}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Detail Promotion */}
      <div
        className="detail-promotion-container d-none"
        ref={detailPromotionContainerRef}
      >
        <div className="detail-promotion-content">
          <div className="promotion-header row text-primary pt-1 mb-2">
            <div
              className="col-10 d-flex align-items-center text-center"
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              <BiSolidDiscount />
              &nbsp;&nbsp;CHỌN KHUYẾN MÃI &nbsp;
            </div>
            <div className="col-2 d-flex align-items-center justify-content-end">
              <button
                type="button"
                class="btn-close"
                aria-label="Close"
                onClick={closeDetailPromotion}
              ></button>
            </div>
          </div>
          <div className="promotion-search">
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Nhập tên khuyến mãi"
                aria-label="Nhập tên khuyến mãi"
                aria-describedby="button-addon2"
              />
              <button
                class="btn btn-outline-primary"
                type="button"
                id="button-addon2"
              >
                Áp dụng
              </button>
            </div>
          </div>
          <div className="scrollable-container">
            <p className="d-flex justify-content-start">
              <strong>Mã giảm giá</strong>
            </p>
            <div className="promotion-items">
              {/* Promotion Items */}
              {promotions.map((promotion) => {
                return (
                  <div
                    className="card mb-3 promotion-item"
                    style={{ maxWidth: "100%" }}
                    key={promotion.id}
                    onClick={() => {
                      setPromotionCurrent(promotion);
                    }}
                  >
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src={`${process.env.PUBLIC_URL}/asset/images/promotionIcon.png`}
                          className="img-fluid rounded-start"
                          style={{
                            width: "60%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                          alt="..."
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title text-start ms-0">
                            {promotion.promotion_name}
                          </h5>
                          <p
                            className="card-text text-start ms-0"
                            style={{
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            Đơn hàng từ{" "}
                            {formatCurrencyVND(promotion.conditional)} - Xem chi
                            tiết để biết thêm về thể lệ chương trình
                          </p>
                          <p className="card-text text-start ms-0">
                            <small className="text-muted">
                              <div className="row">
                                <div className="col-8">
                                  <div
                                    className="progress progress-sm"
                                    style={{ height: "0.5rem" }}
                                  >
                                    <div
                                      className="progress-bar progress-height-0.5"
                                      style={{
                                        width: `${handleProgress(
                                          promotion.conditional,
                                          total
                                        )}%`,
                                        height: "0.5rem",
                                      }}
                                      role="progressbar"
                                      aria-valuenow={`${handleProgress(
                                        promotion.conditional,
                                        total
                                      )}%`}
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                  <p
                                    className="fw-light text-break"
                                    style={{ fontSize: "0.8rem" }}
                                  >
                                    Mua thêm{" "}
                                    {promotion.conditional - total > 0
                                      ? formatCurrencyVND(
                                          promotion.conditional - total
                                        )
                                      : 0}{" "}
                                    để nhận mã
                                  </p>
                                </div>
                                <div className="col-4 m-0 p-0">
                                  <a
                                    className="btn btn-primary m-0"
                                    style={{
                                      width: "80%",
                                      fontSize: "0.2rem",
                                      wordWrap: "break-word",
                                    }}
                                    href="/"
                                    role="button"
                                  >
                                    Mua&nbsp;thêm
                                  </a>
                                </div>
                              </div>
                            </small>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartInfo;
