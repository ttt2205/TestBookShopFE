import React, { useEffect, useState } from "react";
import "../assets/scss/shoppingCart.scss";
import {
  CartTitle,
  CartInfo,
  CartEmpty,
} from "../modules/shopping_cart_module";
import { getAllBillPromotions } from "../services/cartService";
import { toast } from "react-toastify";

function ShoppingCart() {
  const [quantityProductChosen, setQuantityProductChosen] = useState(0);
  const [cartProducts, setCartProducts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [promotionCurrent, setPromotionCurrent] = useState({});
  const [promotionIsEligible, setPromotionIsEligible] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalPromotion, setTotalPromotion] = useState(0);

  // GET PROMOTION BILL
  useEffect(() => {
    const getAllPromotionBill = async () => {
      try {
        const reponsePromotions = await getAllBillPromotions();
        // thêm attribute tính số tiền đủ điều kiện
        reponsePromotions.data.promotions.forEach((promotion) => {
          promotion.isEligible = false;
        });
        setPromotions(reponsePromotions.data.promotions);
        // setup promotion current với promotion đầu tiên trả về
        if (reponsePromotions.data.promotions.length > 0)
          setPromotionCurrent(reponsePromotions.data.promotions[0]);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("Reponse promotions not found");
          console.log(error.response);
        } else {
          console.log("Error fetching reponse promotions data:", error.message);
          console.log(">>>Stack: ", error.stack);
        }
      }
    };
    getAllPromotionBill();
  }, []);

  useEffect(() => {
    handlePromotionIsEligible(promotions, total);
    // Kiểm tra khuyến mãi đủ điều kiện khi total thay đổi
    let count = 0;
    promotions.forEach((promotion) => {
      if (promotion.isEligible === true) count++;
    });
    setPromotionIsEligible(count);

    // Tính toán lại tổng số tiền khi thực hiện áp dụng khuyến mãi đủ điều kiện
    if (promotionCurrent.isEligible) {
      if (promotionCurrent.type === "PhanTram") {
        setTotalPromotion((total * (100 - promotionCurrent.value)) / 100);
      } else {
        let tempTotal = total - promotionCurrent.value;
        if (tempTotal < 0) {
          toast.info(
            `Bạn cần mua thêm ${
              promotionCurrent.value - total
            } để áp dụng được giảm giá`
          );
          setTotalPromotion(total);
        } else setTotalPromotion(total - promotionCurrent.value);
      }
    } else setTotalPromotion(total);
  }, [total, promotionCurrent]);

  // Kiểm tra khuyến mãi đủ điều kiện so với total
  const handlePromotionIsEligible = (promotionArr, total) => {
    const newPromotionArr = [...promotionArr];
    newPromotionArr.map((promotion) => {
      if (promotion.conditional - total <= 0) promotion.isEligible = true;
      else promotion.isEligible = false;
    });
    setPromotions(newPromotionArr);
  };

  // Thay đổi total khi chọn product
  const handleChangeTotal = (total) => {
    setTotal(total);
  };

  // Reset lại giỏ hàng khi có sự thay đổi về số lượng hoặc khi một item bị xóa
  useEffect(() => {
    const checkCartProducts = JSON.parse(localStorage.getItem("cart"));
    if (checkCartProducts) {
      setCartProducts(checkCartProducts);
      setQuantityProductChosen(checkCartProducts.length);
    }
  }, [refreshKey]);

  // RefreshKey dùng để re-render khi có sự thay đổi
  const handleRefreshKey = () => {
    // Tăng refreshKey để component tái render
    setRefreshKey((prevKey) => prevKey + 1);
  };

  // Hàm định dạng tiền tệ Việt Nam
  function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  return (
    <div id="shopping_cart" className="shopping-cart-container">
      {quantityProductChosen === 0 ? (
        <CartEmpty></CartEmpty>
      ) : (
        <div className="shopping-cart-content">
          <div className="cart-title-container">
            <CartTitle
              quantityProductChosen={quantityProductChosen}
            ></CartTitle>
          </div>
          <div className="cart-info-container">
            <CartInfo
              quantityProductChosen={quantityProductChosen}
              cartProducts={cartProducts}
              refreshKey={refreshKey}
              handleRefreshKey={handleRefreshKey}
              handleChangeTotal={handleChangeTotal}
              formatCurrencyVND={formatCurrencyVND}
              promotions={promotions}
              promotionCurrent={promotionCurrent}
              setPromotionCurrent={setPromotionCurrent}
              promotionIsEligible={promotionIsEligible}
              total={total}
              totalPromotion={totalPromotion}
            />
          </div>
        </div>
      )}
      ;
    </div>
  );
}

export default ShoppingCart;
