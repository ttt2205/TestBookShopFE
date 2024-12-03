import React, { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";

const ProductViewThumbnail = React.memo(
  ({ images, handleOnclickThumbnail }) => {
    return (
      <div className="product-view-thumbnail-tabs">
        <div
          id="carouselExampleControls1"
          class="carousel slide thumbnail-tabs"
          data-bs-ride="carousel"
        >
          <div class="carousel-inner tabs-product-view">
            {images.length > 0
              ? images.map((tab, index) => (
                  <div
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                    key={index}
                  >
                    <div className="tab-product-view">
                      {tab.map((image) => (
                        <div className="product-view">
                          <div className="product-view-image-box">
                            <div className="product-view-image-container">
                              <div className="product-view-image-content">
                                <a href="#" title={image.bookImage_id}>
                                  <div
                                    id={image.bookImage_id}
                                    className="image"
                                  >
                                    <img
                                      src={image.url}
                                      alt="Not Found image"
                                      onClick={() =>
                                        handleOnclickThumbnail(image.url)
                                      }
                                    />
                                  </div>
                                </a>
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
            data-bs-target="#carouselExampleControls1"
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
            data-bs-target="#carouselExampleControls1"
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
    );
  }
);

export default ProductViewThumbnail;
