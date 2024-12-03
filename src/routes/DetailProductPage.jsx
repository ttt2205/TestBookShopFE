import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BreadScumb,
  ProductViewEssentialMedia,
  ProductViewReview,
  TabsliderTabRelatedProduct,
  ProductViewEssentialDetail,
} from "../components/user/product_detail_components";
import "../assets/scss/DetailProductPage.scss";
import {
  getDetailProductDataService,
  getRelatedProductDataService,
} from "../services/detailProductService";

function DetailProductPage() {
  // Thuc hien lay product id
  const { productId } = useParams();

  const [detailProduct, setDetailProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  // it uses in Deliveryinfo.jsx for change quantity product
  const [count, setCount] = useState(1);
  const [address, setAddress] = useState("Hà Nội");

  const checkInputProductId = () => {
    const id = Number(productId);
    if (!isNaN(id)) return true;
    return false;
  };
  const handleQuantityChange = (type) => {
    setCount((quantity) => {
      if (type === "increment") return quantity + 1;
      if (type === "decrement") return quantity > 1 ? quantity - 1 : 1;
      return quantity;
    });
  };
  // begin thêm bởi tiệp để lấy detail product mỗi khi param thay đổi
  useEffect(() => {
    const getDetailProductData = async () => {
      if (checkInputProductId()) {
        try {
          console.log(">>>productId ", productId);
          const responeDetailProduct = await getDetailProductDataService(
            productId
          );
          setDetailProduct(responeDetailProduct.data.products);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log("Product not found");
          } else {
            console.log(
              "Error fetching product or related product data:",
              error.message
            );
          }
        }
      }
    };
  
    getDetailProductData();
  }, [productId]); // Thêm productId vào dependency
  // end 
  // Get detail product
  useEffect(() => {
    if (checkInputProductId()) {
      const getDetailProductData = async () => {
        try {
          console.log(">>>productId ", productId);
          const responeDetailProduct = await getDetailProductDataService(
            productId
          );
          setDetailProduct(responeDetailProduct.data.products);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log("Product not found");
            console.log(error.response);
          } else {
            console.log(
              "Error fetching product or related product data:",
              error.message
            );
            console.log(">>>Stack: ", error.stack);
          }
        }
      };
      getDetailProductData(); // Gọi hàm async
    }
  }, []);

  // Get related products based on genreId of detail product
  useEffect(() => {
    // Kiểm tra nếu genreId đã tồn tại trước khi gọi API
    if (detailProduct.genre_id) {
      const getRelatedProductData = async () => {
        try {
          const responseRelatedProduct = await getRelatedProductDataService(
            productId,
            detailProduct.genre_id
          );
          setRelatedProducts(responseRelatedProduct.data.relatedProducts);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log("Related product not found");
            console.log(error.response);
          } else {
            console.log("Error fetching related product data:", error.message);
            console.log(">>>Stack: ", error.stack);
          }
        }
      };
      getRelatedProductData();
    }
  }, [detailProduct.genre_id]);

  // Tim discount tot nhat
  const getDiscountValueLatest = (discounts) => {
    let discountLatest = {
      discountId: null,
      value: 0,
    };
    if (discounts.length > 0) {
      discounts.forEach((discount) => {
        let startAt = new Date(discount.start_at);
        let endAt = new Date(discount.end_at);
        let day = new Date();
        if (day >= startAt && day <= endAt) {
          if (discount.percent_value >= discountLatest.value) {
            discountLatest.value = discount.percent_value;
            discountLatest.discountId = discount.discount_id;
          }
        }
      });
    }
    return discountLatest;
  };

  const handleChangeAddress = (newAddress) => {
    setAddress(newAddress);
  };

  return (
    <>
      {!checkInputProductId() ||
      !detailProduct ||
      Object.keys(detailProduct).length === 0 ? (
        <>
          <h2>Product is not exist</h2>
        </>
      ) : (
        <>
          <div id="breadscumbs" className="breadscumb-container mb-2">
            <BreadScumb genreId={detailProduct.genre_id}></BreadScumb>
          </div>
          <form id="product_addToCart_form">
            {/* <!-- begin product view UI --> */}
            <div id="product_view_detail" className="product-essential">
              <ProductViewEssentialMedia
                productID={productId}
                count={count}
                detailProduct={detailProduct}
                getDiscountValueLatest={getDiscountValueLatest}
                address={address}
              ></ProductViewEssentialMedia>
              <ProductViewEssentialDetail
                detailProduct={detailProduct}
                count={count}
                handleQuantityChange={handleQuantityChange}
                getDiscountValueLatest={getDiscountValueLatest}
                handleChangeAddress={handleChangeAddress}
              ></ProductViewEssentialDetail>
            </div>
          </form>
          <div
            id="tabslider_tab_relatedproduct"
            className="tabslider-relatedproduct-container"
          >
            <TabsliderTabRelatedProduct
              getDiscountValueLatest={getDiscountValueLatest}
              relatedProducts={relatedProducts}
            ></TabsliderTabRelatedProduct>
          </div>
          <div
            id="product_view_review"
            className="product-view-review-container"
          >
            <ProductViewReview></ProductViewReview>
          </div>
        </>
      )}
    </>
  );
}

export default DetailProductPage;
