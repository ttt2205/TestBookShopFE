import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "assets/scss/productSearch.scss";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ProductSearch = React.forwardRef(({ containerRef }, ref) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // State để xác định màn hình nhỏ
  const navigate = useNavigate();

  const searchContainerRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/book?page=1&limit=10000"
        );
        const books = response.data.books;
        setProducts(books);
        setFilteredProducts(books);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width >= 480 && width <= 767);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    filterProducts();
  }, [search]);

  const filterProducts = () => {
    if (search) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase().trim())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleNavigateToProduct = (book_id, title) => {
    // Sử dụng "navigate" với "replace: false" để đảm bảo React Router xử lý lại
    navigate(`/detail-product/${book_id}/${encodeURIComponent(title)}`, {
      replace: false,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (filteredProducts.length > 0) {
        handleNavigateToProduct(
          filteredProducts[0].book_id,
          filteredProducts[0].title
        );
      } else {
        navigate(`/products?query=${search}`);
      }
    }
  };
  const handleNavigate = () => {
    search ? navigate(`/products?query=${search}`) : navigate("/products");
};
  return (
    <div
      className={`position-relative ${
        isMobile ? "product-container" : "product-search-container"
      }`}
      ref={isMobile ? containerRef : searchContainerRef}
      onMouseLeave={() => setShowSearchPanel(false)}
    >
      <div className="input-group">
        <input
          type="text"
          placeholder="Trading Card Game"
          value={search}
          className="form-control"
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => {
            setShowSearchPanel(true);
          }}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-danger search-button" onClick={handleNavigate}>
                    <IoIosSearch />
                </button>
      </div>

      {showSearchPanel && (
        <div className="search-panel w-100">
          {filteredProducts.length > 0 ? (
            <div className="product-suggestions">
              {filteredProducts.slice(0, 5).map((product) => (
                <div
                  key={product.book_id}
                  className="product-item"
                  onClick={() =>
                    handleNavigateToProduct(product.book_id, product.title)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={product.image?.url}
                    alt={product.title}
                    className="product-image"
                  />
                  <span className="product-title">{product.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">Không tìm thấy sản phẩm nào</div>
          )}
        </div>
      )}
    </div>
  );
});

export default ProductSearch;
