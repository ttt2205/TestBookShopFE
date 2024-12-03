import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getOrders,
  updateConfirm,
} from "../../services/orderConfirmationService";
import { useLoaderData } from "react-router-dom";
import Pagination from "./Pagination";

export async function loader() {
  const ordersData = await getOrders();
  return { ordersData };
}

function OderConfirmation() {
  const { ordersData } = useLoaderData();

  const [orders, setOrders] = useState([]);
  const [orderArranged, setOrderArranged] = useState([]);
  const [ordersToRender, setOrdersToRender] = useState([]);
  const [orderStatus, setOrderStatus] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });
  // State của chi tiết đơn hàng
  const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng được chọn
  const [orderDetails, setOrderDetails] = useState({});
  const totalPages = Math.ceil(orderArranged.length / pagination.itemsPerPage);
  const [arrangeMethod, setArrangeMethod] = useState("asc");
  const [inputSearch, setInputSearch] = useState("");

  const [selectedValue, setSelectedValue] = useState("order_id"); // Lưu giá trị đã chọn
  const options = [
    { OderId: "order_id" },
    { CustomerId: "customer_id" },
    { TotalAmount: "total_amount" },
  ];

  // Dữ liệu mẫu: danh sách đơn hàng của Customer
  // const customerOrders = [
  //   { id: 101, status: "Chờ xác nhận", date: "2024-11-24", total: 250 },
  //   { id: 102, status: "Đã giao", date: "2024-11-22", total: 300 },
  //   { id: 103, status: "Đã hủy", date: "2024-11-21", total: 100 },
  // ];

  // Dữ liệu mẫu: chi tiết sản phẩm của từng đơn hàng
  // const orderDetails = {
  //   101: [
  //     { id: 1, productName: "Laptop", quantity: 1, price: 200 },
  //     { id: 2, productName: "Mouse", quantity: 1, price: 50 },
  //   ],
  //   102: [{ id: 3, productName: "Headphones", quantity: 1, price: 300 }],
  //   103: [{ id: 4, productName: "Notebook", quantity: 2, price: 50 }],
  // };

  // Gan status cho cac don hang
  useEffect(() => {
    // Gan order tu api
    setOrders([...ordersData.orders]);
    setOrderArranged([...ordersData.orders]);

    // Get data orderDetails
    const newOrderDetail = {};
    ordersData.orders.forEach((item) => {
      newOrderDetail[item.order_id] = item.batches.map((batche) => ({
        id: batche.book_id,
        productName: batche.books.title,
        quantity: batche.orderdetails.quantity,
        price: batche.orderdetails.final_price,
      }));
    });
    setOrderDetails(newOrderDetail);

    // Gán orderStatus
    const newOrderStatus = ordersData.orders.reduce((acc, order) => {
      acc[order.order_id] = order.status_id;
      return acc;
    }, {});

    setOrderStatus(newOrderStatus);
  }, [ordersData]);

  // Thuc hien sap xep
  useEffect(() => {
    if (orderArranged.length > 0)
      handleArrangeOrderFollowInputSearch(inputSearch);
  }, [arrangeMethod, selectedValue]);

  useEffect(() => {
    renderTable(pagination.currentPage);
    console.log("orderDetail", orderDetails);
  }, [orderStatus, pagination.currentPage, orderArranged]);

  const handleChangeArrangedMethod = (event) => {
    setArrangeMethod(event.target.value);
  };

  // Format currency VND
  function formatCurrencyVND(number) {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  // Function to render table rows
  function renderTable(page) {
    const start = (page - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    const rows = orderArranged.slice(start, end);
    setOrdersToRender(rows);
  }

  // debounce khi nguoi dung nhap tu khoa tim kiem
  function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
      setInputSearch(args[0]);
      // Xóa timeout trước đó (nếu có)
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Đặt lại timeout mới
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  // Ham sap xep
  function sortOrders(orders, key, order = "asc") {
    if (!Array.isArray(orders)) {
      throw new Error("Input phải là một mảng các orders.");
    }

    return orders.sort((a, b) => {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        throw new Error(`Thuộc tính '${key}' không tồn tại trong đối tượng.`);
      }

      const valueA = a[key];
      const valueB = b[key];

      if (order === "asc") {
        // Sắp xếp tăng dần
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else if (order === "desc") {
        // Sắp xếp giảm dần
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      } else {
        throw new Error("Tham số 'order' phải là 'asc' hoặc 'desc'.");
      }
    });
  }

  // Xu ly tim kiem cua nguoi dung
  const handleArrangeOrderFollowInputSearch = (searchQuery) => {
    if (searchQuery.trim() === "") {
      setOrderArranged(sortOrders([...orders], selectedValue, arrangeMethod));
    } else {
      const filteredOrders = orders
        .filter((order) => {
          // Các điều kiện lọc
          const byOrderId = order.order_id
            ?.toString()
            .includes(searchQuery.trim());
          const byTotal = order.total_amount
            ?.toString()
            .includes(searchQuery.trim());
          const byAddress = order.address
            ?.toLowerCase()
            .includes(searchQuery.trim().toLowerCase());

          // Trả về true nếu thỏa bất kỳ điều kiện nào
          return byOrderId || byTotal || byAddress;
        }) // Ví dụ: lọc các order có status_id = 1
        .map((order) => JSON.parse(JSON.stringify(order))); // Sao chép sâu từng đối tượng
      setOrderArranged(
        sortOrders([...filteredOrders], selectedValue, arrangeMethod)
      );
    }
  };

  // Xu ly debounce khi nguoi dung nhap
  const handleInputSearch = debounce(handleArrangeOrderFollowInputSearch, 400);

  // Xu ly thay doi gia tri sap xep
  const handleOnchangeOptionValue = (event) => {
    setSelectedValue(event.target.value); // Cập nhật giá trị vào state
  };

  const handleConfirmOrder = async (orderId, status) => {
    const res = await updateConfirm(orderId, status);
    if (res.error === 0)
      setOrderStatus((prevOrderStatus) => ({
        ...prevOrderStatus,
        [orderId]: 2,
      }));
    console.log(">>> confirm order: ", res.message);
  };

  const handleCancelOrder = async (orderId, status) => {
    const res = await updateConfirm(orderId, status);
    if (res.error === 0)
      setOrderStatus((prevOrderStatus) => ({
        ...prevOrderStatus,
        [orderId]: 5,
      }));
    console.log(">>> cancel order: ", res.message);
  };

  // Mở modal để xem chi tiết sản phẩm
  const handleShowDetails = (orderId) => {
    setSelectedOrder(orderId);
  };

  return (
    <>
      <div className="mb-2 w-100 d-flex" style={{ height: "2.5rem" }}>
        <div className="w-50 d-flex">
          {/* Chọn thuộc tính muốn sắp xếp */}
          <select
            id="arrange_attribute"
            className="form-select"
            style={{ width: "35%" }}
            aria-label="Default select example"
            value={selectedValue}
            onChange={handleOnchangeOptionValue}
          >
            {options.map((option) => (
              <option value={Object.values(option)}>
                {Object.keys(option)}
              </option>
            ))}
          </select>
          {/* Cách sắp xếp */}
          <select
            id="arrange_method"
            className="form-select"
            style={{ width: "35%", marginLeft: "0.5rem" }}
            aria-label="Default select example"
            // value={arrangeMethod}
            onChange={handleChangeArrangedMethod}
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>
        {/* Search */}
        <div className="w-50">
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Search
            </span>
            <input
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              value={inputSearch}
              onChange={(e) => {
                handleInputSearch(e.currentTarget.value);
              }}
            />
          </div>
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">OderId</th>
            <th scope="col">CustomerId</th>
            <th scope="col">TotalAmount</th>
            <th scope="col">BillPromotionId</th>
            <th scope="col">Address</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {ordersToRender.map((oder, index) => {
            return (
              <tr
                id={oder.order_id}
                onClick={(e) => {
                  handleShowDetails(e.currentTarget.id);
                }}
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                <td>{oder.order_id}</td>
                <td>{oder.customer_id}</td>
                <td>{formatCurrencyVND(oder.total_amount)}</td>
                <td>{oder.billPromotion_id || "Không có"}</td>
                <td>{oder.address}</td>
                <td>
                  {orderStatus[oder.order_id] === 1 ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                          handleConfirmOrder(oder.order_id, "confirm");
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          handleCancelOrder(oder.order_id, "cancel");
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : orderStatus[oder.order_id] === 2 ? (
                    <button type="button" className="btn btn-secondary">
                      Chờ thanh toán
                    </button>
                  ) : orderStatus[oder.order_id] === 3 ? (
                    <button type="button" className="btn btn-secondary">
                      Đã thanh toán
                    </button>
                  ) : orderStatus[oder.order_id] === 4 ? (
                    <button type="button" className="btn btn-secondary">
                      Đã giao hàng
                    </button>
                  ) : (
                    <button type="button" className="btn btn-secondary">
                      Đã hủy
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        page={pagination.currentPage}
        setPage={(page) => {
          setPagination((prev) => {
            return { ...prev, currentPage: page };
          });
        }}
        total_page={totalPages}
      />

      {/* <!-- Scrollable modal --> */}
      <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">
                Chi tiết đơn hàng #{selectedOrder}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="modal-dialog modal-dialog-scrollable">
                {selectedOrder && orderDetails[selectedOrder] ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Mã sản phẩm</th>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails[selectedOrder].map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrencyVND(item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Không tìm thấy chi tiết đơn hàng.</p>
                )}
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OderConfirmation;
