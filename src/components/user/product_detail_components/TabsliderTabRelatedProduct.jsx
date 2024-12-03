import React, { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";
import { CiStar } from "react-icons/ci";
import { Link } from "react-router-dom";

function TabsliderTabRelatedProduct({
  relatedProducts,
  getDiscountValueLatest,
}) {
  const [tabsRelatedProduct, setTabsRelatedProduct] = useState([]);

  useEffect(() => {
    const fetchDataAboutRelatedProduct = async () => {
      try {
        const relatedProductArrayChunked = chunksArray(relatedProducts, 4);
        setTabsRelatedProduct(relatedProductArrayChunked);
      } catch (error) {
        console.log("relatedProductArrayChunked error = ", error.message);
        console.log(">>>Stack: ", error.stack);
      }
    };
    fetchDataAboutRelatedProduct();
  }, [relatedProducts]);

  useEffect(() => {
    console.log("tabs", tabsRelatedProduct); // This will log after state has been updated
  }, [tabsRelatedProduct]); // Runs every time `tabsRelatedProduct` changes

  // Phan chia relatedProduct thanh 4 phan trong 1 nhom
  const chunksArray = (arr, size) => {
    let newArr = [];
    let length = arr.length;
    for (let i = 0; i < length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  };

  const getPathImage = (images) => {
    const urlImage = images.find((item) => {
      if (item.is_main === 1) return item;
    });
    return urlImage.url;
  };

  // Hàm định dạng tiền tệ Việt Nam
  function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  // Hàm format params name của url
  const formatNameParamOfUrl = (bookTitle) => {
    return bookTitle.split(/[- _]/).join("-");
  };

  return (
    <>
      <div className="tabslier-relatedproduct-title">
        <strong>FAHASA GIỚI THIỆU</strong>
      </div>
      <div className="tabslider-tabs-content-relatedproduct">
        <div className="tabslider-tabs-relatedproduct">
          <div
            id="carouselExampleControls"
            class="carousel slide tabslider-tabs"
            data-bs-ride="carousel"
          >
            <div class="carousel-inner tabs-relatedproduct">
              {tabsRelatedProduct.length > 0
                ? tabsRelatedProduct.map((tab, index) => (
                    <div
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                      key={index}
                    >
                      <div className="tab-relatedproduct">
                        {tab.map((related) => (
                          <div className="relatedproduct" key={related.book_id}>
                            <div className="relatedproduct-image-box">
                              <div className="relatedproduct-image-container">
                                <div className="relatedproduct-image-content">
                                  <a
                                    href={`/detail-product/${
                                      related.book_id
                                    }/${formatNameParamOfUrl(related.title)}`}
                                    title={related.title}
                                  >
                                    <div className="image">
                                      <img
                                        src={
                                          getPathImage(related.alt_images) ||
                                          "book26_v1.jpg"
                                        }
                                        alt="Not Found image"
                                      />
                                    </div>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="relatedproduct-name-container">
                              <div className="relatedproduct-name-content">
                                <p>{related.title}</p>
                              </div>
                            </div>
                            <div className="relatedproduct-price-and-discount-container">
                              <div className="relatedproduct-price-and-discount-content">
                                <div className="relatedproduct-discount">
                                  <p id="price-now">
                                    <strong>
                                      {related.discounts.length !== 0
                                        ? formatCurrencyVND(
                                            Math.round(
                                              parseFloat(
                                                related.sale_price,
                                                10
                                              ) *
                                                (100 -
                                                  parseFloat(
                                                    getDiscountValueLatest(
                                                      related.discounts
                                                    ).value,
                                                    10
                                                  ))
                                            ) / 100
                                          )
                                        : formatCurrencyVND(
                                            Math.round(
                                              parseFloat(related.sale_price, 10)
                                            )
                                          )}
                                      &nbsp;
                                    </strong>
                                  </p>
                                  {related.discounts.length !== 0 ? (
                                    <p id="discount">
                                      <strong>
                                        -
                                        {
                                          getDiscountValueLatest(
                                            related.discounts
                                          ).value
                                        }
                                        %
                                      </strong>
                                    </p>
                                  ) : null}
                                </div>
                                <div className="relatedproduct-price">
                                  {related.discounts.length !== 0 ? (
                                    <p id="price">
                                      {formatCurrencyVND(related.sale_price)}
                                      &nbsp;
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div className="relatedproduct-rating-container">
                              <div className="relatedproduct-rating-content">
                                <div className="card">
                                  <div className="ratings-wrapper">
                                    <div className="ratings">
                                      <div id="stars-container">
                                        <CiStar
                                          className="far fa-star rating-color"
                                          size={25}
                                        />
                                        <CiStar
                                          className="far fa-star rating-color"
                                          size={25}
                                        />
                                        <CiStar
                                          className="far fa-star rating-color"
                                          size={25}
                                        />
                                        <CiStar
                                          className="far fa-star rating-color"
                                          size={25}
                                        />
                                        <CiStar
                                          className="far fa-star rating-color"
                                          size={25}
                                        />
                                      </div>
                                    </div>
                                    <p className="review-count">12 Reviews</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                : undefined}
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span
                class="carousel-prev-icon carousel-control-prev-icon"
                aria-hidden="true"
              >
                <FiChevronLeft size={40}></FiChevronLeft>
              </span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span
                class="carousel-next-icon carousel-control-next-icon"
                aria-hidden="true"
              >
                <FiChevronRight size={40}></FiChevronRight>
              </span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TabsliderTabRelatedProduct;
