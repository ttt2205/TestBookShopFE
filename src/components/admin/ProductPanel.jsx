import {
  useLoaderData,
  Link,
  Form,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { getPage, getProductById } from "services/productServices";
import ProductPagination from "./Pagination";
import { useEffect, useState } from "react";

export default function ProductPanel() {
  const [responseData, setResponseData] = useState({
    books: [],
    total_page: 1,
  });
  const [formData, setFormData] = useState({
    q: "",
    searchType: "all",
    page: 1,
    limit: 10,
    sortBy: "book_id",
    sortType: "asc",
  });
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setSearching(true);
    getPage(formData).then((data) => {
      setResponseData(data);
      setSearching(false);
    });
  }, [formData]);

  return (
    <>
      <div id="search-form" role="search">
        <div className="row mb-3">
          <div className="col col-md-2">
            <select
              name="type"
              className="form-select"
              aria-label="label for the select"
              defaultValue={formData.type}
              id="type"
              onChange={(e) => {
                setFormData({ ...formData, type: e.target.value });
              }}
            >
              <option value="all">All</option>
              <option value="id">ID</option>
              <option value="title">Title</option>
              <option value="publisher">Publisher</option>
            </select>
          </div>
          <div className="col col-md-5">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                id="q"
                type="text"
                placeholder="Tìm kiếm"
                name="q"
                defaultValue={formData.q}
                onChange={(event) => {
                  setFormData({ ...formData, q: event.target.value });
                }}
                className="form-control"
              />
            </div>
          </div>
          <select
            id="limit"
            name="limit"
            className="form-select ms-2 col "
            aria-label="label for the select"
            defaultValue={formData.limit}
            onChange={(e) => {
              setFormData({ ...formData, limit: e.target.value });
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>

          <Link to="add" className="btn btn-primary text-light col ms-2">
            New
          </Link>
        </div>
      </div>
      <div className="table-responsive-md">
        <table className="table table-hover">
          <thead>
            <tr>
              <th
                scope="col"
                onClick={() => {
                  setFormData({
                    ...formData,
                    sortBy: "book_id",
                    sortType:
                      formData.sortBy === "book_id" &&
                      formData.sortType === "asc"
                        ? "desc"
                        : "asc",
                  });
                }}
              >
                Book ID <i className="fa-solid fa-sort"></i>
              </th>
              <th
                scope="col"
                onClick={() => {
                  setFormData({
                    ...formData,
                    sortBy: "title",
                    sortType:
                      formData.sortBy === "title" && formData.sortType === "asc"
                        ? "desc"
                        : "asc",
                  });
                }}
              >
                Title <i className="fa-solid fa-sort"></i>
              </th>
              <th scope="col">Image</th>
              <th
                scope="col"
                onClick={() => {
                  setFormData({
                    ...formData,
                    sortBy: "publisher",
                    sortType:
                      formData.sortBy === "publisher" &&
                      formData.sortType === "asc"
                        ? "desc"
                        : "asc",
                  });
                }}
              >
                Publisher <i className="fa-solid fa-sort"></i>
              </th>
              <th
                scope="col"
                onClick={() => {
                  setFormData({
                    ...formData,
                    sortBy: "stock_quantity",
                    sortType:
                      formData.sortBy === "stock_quantity" &&
                      formData.sortType === "asc"
                        ? "desc"
                        : "asc",
                  });
                }}
              >
                Stock Quantity <i className="fa-solid fa-sort"></i>
              </th>
              <th scope="col">Status ID</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {responseData.books.map((book) => (
              <tr key={book.book_id}>
                <th scope="row">{book.book_id}</th>
                <td>{book.title}</td>
                <td>
                  <img src={book.image?.url} alt={book.title} width="100" />
                </td>
                <td>{book.publisher?.name}</td>
                <td>{book.stock_quantity}</td>
                <td>{book.status_id}</td>
                <td>
                  <Link
                    to={`edit/${book.book_id}`}
                    className="btn btn-warning text-light"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ProductPagination
          page={formData.page}
          setPage={(page) => {
            setFormData({ ...formData, page });
          }}
          total_page={responseData.total_page}
        />
      </div>
    </>
  );
}
