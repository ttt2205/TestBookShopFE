import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RenderContent from './RenderContent';
import PaginationComponent from './pagination';
import { useSearchParams } from 'react-router-dom';
import 'assets/scss/advancedSearch.scss';

const AdvancedSearch = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const query = searchParams.get('query');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([]);
  const [categories, setCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;  // tăng giảm tùy vào số lượng sản phẩm muốn hiển thị
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedChildCategories, setSelectedChildCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/book?page=1&limit=10000'),
          axios.get('http://localhost:8080/api/book/reference/genres'),
        ]);

        const books = productsResponse.data.books;
        const { mainCategories, subCategories } = categoriesResponse.data.data;

        setProducts(books);
        setFilteredProducts(books);
        setCategories(mainCategories);
        setChildCategories(subCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCategoriesAndProducts();
  }, []);
  useEffect(() => {
    if (selectedCategory) {
      filterProducts();
    }
    filterProducts();
  }, [selectedCategory, products]);
  useEffect(() => {
    filterProducts(); // Lọc lại sản phẩm khi `query` thay đổi
  }, [query]);
  useEffect(() => {
    if (categoryFromUrl) {
      const mainCategory = categories.find(cat => cat.name === categoryFromUrl);
      const subCategory = childCategories.find(subCat => subCat.name === categoryFromUrl);

      if (mainCategory) {
        setSelectedCategory([mainCategory.name]);
        setSelectedChildCategories([]);
      } else if (subCategory) {
        const parentCategory = categories.find(cat => cat.genre_id === subCategory.parent_id);
        if (parentCategory) {
          setSelectedCategory([parentCategory.name]);
          setSelectedChildCategories([subCategory.name]);
        }
      }
    }
  }, [categoryFromUrl, categories, childCategories]);

  const handleCategoryChange = (genreName) => {
    setSelectedCategory(prevState =>
      prevState.includes(genreName)
        ? prevState.filter(name => name !== genreName)
        : [...prevState, genreName]
    );
    setSelectedChildCategories([]);
  };

  const handleChildCategoryChange = (genreName) => {
    setSelectedChildCategories(prevState =>
      prevState.includes(genreName)
        ? prevState.filter(name => name !== genreName)
        : [...prevState, genreName]
    );
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(prevState =>
      prevState.includes(range)
        ? prevState.filter(r => r !== range)
        : [...prevState, range]
    );
  };

  const handleSupplierChange = (supplier) => {
    setSelectedSupplier(prevState =>
      prevState.includes(supplier)
        ? prevState.filter(s => s !== supplier)
        : [...prevState, supplier]
    );
  };

  const filterProducts = () => {
    let filtered = products;
    if (query) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase().trim())
      );
    }

    if (selectedCategory.length > 0) {
      const selectedMainCategories = selectedCategory.map(categoryName =>
        categories.find(cat => cat.name === categoryName)
      );

      const mainCategoryIds = selectedMainCategories.map(cat => cat.genre_id);
      const subCategoryIds = childCategories
        .filter(subCat => mainCategoryIds.includes(subCat.parent_id))
        .map(subCat => subCat.genre_id);

      filtered = filtered.filter(product =>
        mainCategoryIds.includes(product.genre_id) ||
        subCategoryIds.includes(product.genre_id)
      );
    }

    if (selectedChildCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedChildCategories.includes(product.genre.name)
      );
    }

    if (priceRange.length > 0) {
      filtered = filtered.filter(product => {
        const productPrice = parseInt(product.sale_price);
        return priceRange.some(range => {
          const [min, max] = range.split('-').map(Number);
          return productPrice >= min && (!max || productPrice <= max);
        });
      });
    }

    if (selectedSupplier.length > 0) {
      filtered = filtered.filter(product =>
        selectedSupplier.includes(product.language.language_name)
      );
    }

    setFilteredProducts(filtered);
    
  };

  useEffect(() => {
    filterProducts();
    
  }, [search, selectedCategory, selectedChildCategories, priceRange, selectedSupplier]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="product-search-container container">
        <div className="sidebar mt-3">
          <h4 className="fw-b">Lọc theo</h4>

          <h5>Danh mục chính</h5>
          <ul className="categories-list">
            {categories.map((category, index) => (
              <li key={`${category.name}-${index}`}>
                <label>
                  <input
                    type="checkbox"
                    name="mainCategory"
                    checked={selectedCategory.includes(category.name)}
                    onChange={() => handleCategoryChange(category.name)}
                  />
                  {category.name}
                </label>
              </li>
            ))}
          </ul>

          {selectedCategory.length > 0 && childCategories.length > 0 && (
            <>
              <h5>Danh mục phụ</h5>
              <ul className="categories-list">
                {childCategories
                  .filter(category => selectedCategory.some(mainCat =>
                    categories.find(cat => cat.name === mainCat && cat.genre_id === category.parent_id)
                  ))
                  .map((category, index) => (
                    <li key={`${category.name}-${index}`}>
                      <label>
                        <input
                          type="checkbox"
                          name={`childCategory-${category.name}`}
                          checked={selectedChildCategories.includes(category.name)}
                          onChange={() => handleChildCategoryChange(category.name)}
                        />
                        {category.name}
                      </label>
                    </li>
                  ))}
              </ul>
            </>
          )}

          <h4>Giá</h4>
          <ul className="price-range-list">
            {['0-150000', '150000-300000', '300000-500000', '500000-700000', '700000'].map((range, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    name="price"
                    checked={priceRange.includes(range)}
                    onChange={() => handlePriceRangeChange(range)}
                  />
                  {range === '700000' ? '700,000đ Trở Lên' : `${range.replace('-', 'đ - ')}đ`}
                </label>
              </li>
            ))}
          </ul>

          <h4>Ngôn ngữ</h4>
          <ul className="suppliers-list">
            {['Vietnamese', 'English', 'French'].map((lang, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    name="supplier"
                    checked={selectedSupplier.includes(lang)}
                    onChange={() => handleSupplierChange(lang)}
                  />
                  {lang === 'Vietnamese' ? 'Tiếng Việt' : lang === 'English' ? 'Tiếng Anh' : 'Tiếng Pháp'}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="main-content">
          <RenderContent books={currentProducts} />
        </div>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default AdvancedSearch;
