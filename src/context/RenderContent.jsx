import React, { useEffect } from "react";
import "assets/scss/homePageUser.scss";
import "assets/scss/shoppingTrend.scss";
import { useNavigate } from "react-router-dom";
const RenderContent = ({ books = [] }) => {
    const navigate = useNavigate();
    const calculatePrices = (sale_price, discounts = []) => {
        const newPrice = parseInt(sale_price);
        const percent_value = discounts.length > 0
            ? Math.max(...discounts.map(discount => discount.percent_value))
            : 0;
        const oldPrice = Math.round((newPrice + percent_value / 100 * newPrice));
        return { percent_value, newPrice, oldPrice };
    };
    const handleNavigate = (book_id, title) => {
        navigate(`/detail-product/${book_id}/${title}`);
      };
      
    return (
        <div className="row">
            {books.length > 0 ? (
                books.map((book) => {
                    const { book_id, title, sale_price, discounts, stock_quantity, image } = book;

                    const { percent_value, newPrice, oldPrice } = calculatePrices(sale_price, discounts);

                    return (
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={book_id} onClick={() => handleNavigate(book_id, title)}>
                            <div className="book-item">
                                {/* Image Section */}
                                <div className="image-container">
                                    {/* Discount Badge */}
                                    {percent_value > 0 && (
                                        <div className="discount-rate">
                                            -{percent_value}%
                                        </div>
                                    )}


                                    {image && image.url ? (
                                        <img
                                            src={image.url}
                                            alt={title}
                                            className="product-img img-fluid"
                                        />
                                    ) : (
                                        <p>Ảnh không có sẵn</p>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="content-container">
                                    <p className="book-title">
                                        <b>{title}</b>
                                    </p>

                                    {/* Price Section */}
                                    <p className="book-price">
                                        {/* Conditionally render old price */}
                                        {oldPrice > newPrice && (
                                            <span className="old-price">
                                                {oldPrice.toLocaleString()} đ
                                            </span>
                                        )}
                                        <span className="new-price">
                                            {newPrice.toLocaleString()} đ
                                        </span>
                                    </p>

                                    {/* Stock Section */}
                                    <p className="sold-amount">Số lượng {stock_quantity}</p>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>Không tìm thấy sản phẩm nào</p>
            )}
        </div>
    );
};

export default RenderContent;
