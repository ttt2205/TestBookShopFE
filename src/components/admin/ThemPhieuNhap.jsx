import {
  useLoaderData,
  Link,
  Form,
  useSubmit,
  useNavigate,
} from "react-router-dom";
import ProductPagination from "./Pagination";
import { useEffect, useState } from "react";
import { createReceipt, getAllProviders } from "services/purchaseServices";
import { toast } from "react-toastify";
import { getPage } from "services/productServices";

export async function loader({ request }) {
  let { providers } = await getAllProviders();
  return { providers };
}

export async function action({ request }) {
  let formData = await request.formData();
  let purchaseDetails = JSON.parse(formData.get("purchaseDetails"));
  let provider_id = formData.get("provider_id");
  let res = await createReceipt({ purchaseDetails, provider_id });
  if (res) {
    toast.success("Tạo phiếu nhập thành công");
  }
  return null;
}

const ThemPhieuNhap = () => {
  const { providers } = useLoaderData();
  const [responseData, setResponseData] = useState({
    books: [],
    total_page: 1,
  });
  const [formData, setFormData] = useState({
    q: "",
    searchType: "all",
    page: 1,
    limit: 6,
    sortBy: "book_id",
    sortType: "asc",
  });
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const submit = useSubmit();
  const navigate = useNavigate();
  let total = purchaseDetails.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);

  const handleSelectBook = (book) => {
    let found = purchaseDetails.find((item) => item.book_id === book.book_id);
    if (found) {
      found.quantity = parseInt(found.quantity) + 1;
      const newpurchaseDetails = [...purchaseDetails];
      setPurchaseDetails(newpurchaseDetails);
    } else {
      setPurchaseDetails([
        { ...book, quantity: 1, price: 0 },
        ...purchaseDetails,
      ]);
    }
  };

  const handleChangeQuantity = (e, book_id) => {
    const found = purchaseDetails.find((item) => item.book_id === book_id);

    if (found) {
      found.quantity = parseInt(e.target.value);
      const newpurchaseDetails = [...purchaseDetails]; // Tạo bản sao mới của mảng
      setPurchaseDetails(newpurchaseDetails); // Cập nhật lại state
    }
  };

  const handleDelete = (book_id) => {
    const newpurchaseDetails = purchaseDetails.filter(
      (item) => item.book_id !== book_id
    );
    setPurchaseDetails(newpurchaseDetails);
  };

  const handleChangePrice = (e, book_id) => {
    const found = purchaseDetails.find((item) => item.book_id === book_id);

    if (found) {
      found.price = e.target.value;
      const newpurchaseDetails = [...purchaseDetails]; // Tạo bản sao mới của mảng
      setPurchaseDetails(newpurchaseDetails); // Cập nhật lại state
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let json = JSON.stringify(purchaseDetails);
    let provider_id = document.getElementById("provider_id").value;
    let formData = new FormData();
    formData.append("purchaseDetails", json);
    formData.append("provider_id", provider_id);
    submit(formData, {
      method: "POST",
    });
  };

  useEffect(() => {
    getPage(formData).then((data) => {
      setResponseData(data);
    });
  }, [formData]);

  return (
    <>
      <h1>Thêm phiếu nhập</h1>
      <div className="row mb-3">
        <button
          className="btn btn-secondary col-2"
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </div>

      <Form className="w-100">
        <div>
          <input
            id="q"
            // className={searching ? "loading" : ""}
            aria-label="Search contacts"
            placeholder="Search"
            type="search"
            name="q"
            defaultValue={""}
            onChange={(event) => {
              setFormData({ ...formData, q: event.target.value, page: 1 });
            }}
          />
          {/* <div id="search-spinner" hidden={!searching} aria-hidden /> */}
          <div className="sr-only" aria-live="polite"></div>
        </div>
      </Form>

      <div className="d-flex flex-column">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Title</th>
              <th>Image</th>
              <th>Stock Quantity</th>
              <th>Status ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {responseData.books.map((book) => (
              <tr key={book.book_id}>
                <th scope="row">{book.book_id}</th>
                <td>{book.title}</td>
                <td style={{ padding: "2px" }}>
                  <div
                    style={{
                      backgroundImage: `url('${book.image.url}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "50px",
                    }}
                  ></div>
                </td>
                <td>{book.stock_quantity}</td>
                <td>{book.status_id}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={(e) =>
                      handleSelectBook({
                        book_id: book.book_id,
                        title: book.title,
                      })
                    }
                  >
                    Thêm
                  </button>
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
      <Form
        id="formChiTietPhieuNhap"
        method="POST"
        className="mb-3"
        onSubmit={handleSubmit}
      >
        <table className="table">
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Title</th>
              <th>Quantity</th>
              <th>Price Receipt</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {purchaseDetails.map((book, index) => (
              <tr key={book.book_id}>
                <th scope="row">{book.book_id}</th>
                <td>{book.title}</td>
                <td>
                  <input
                    type="number"
                    value={book.quantity}
                    onChange={(e) => handleChangeQuantity(e, book.book_id)}
                    min={1}
                    style={{ maxWidth: "80px" }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={book.price}
                    onChange={(e) => handleChangePrice(e, book.book_id)}
                    min={0}
                    style={{ maxWidth: "120px" }}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={(e) => handleDelete(book.book_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Form>

      <div className="d-flex">
        <div className="form-group">
          <select name="providerID" id="provider_id" className="form-select">
            <option value="">Chọn nhà cung cấp</option>
            {providers.map((provider) => (
              <option value={provider.id}>{provider.name}</option>
            ))}
          </select>
        </div>
        <h4 className="ms-3">
          Tổng tiền: {new Intl.NumberFormat("en-US").format(total)}
        </h4>
      </div>

      <div className="d-flex justify-content-center">
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
        >
          Lưu
        </button>
      </div>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Xác nhận
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Xác nhận tạo phiếu nhập</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                form="formChiTietPhieuNhap"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemPhieuNhap;
