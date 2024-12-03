import { useEffect, useState } from "react";
import { Link, useLoaderData, Form } from "react-router-dom";
import { getAllProviders, getPage } from "services/purchaseServices";
import Pagination from "./Pagination";
import DateRangePicker from "./DateRangePicker";
import NumberRangeInput from "./NumberRangeInput";

export async function loader({ request }) {
  let { providers } = await getAllProviders();
  return { providers };
}

export default function NhapHangPanel() {
  const [responseData, setResponseData] = useState({
    receipts: [],
    total_page: 1,
    page: 1,
  });
  const [formData, setFormData] = useState({
    q: "",
    searchType: "all",
    page: 1,
    limit: 10,
    orderType: "asc",
    orderBy: "createdAt",
    startDate: "",
    endDate: "",
    startTotal: "",
    endTotal: "",
    provider_id: "",
  });
  const { providers } = useLoaderData();

  const numberFormatter = new Intl.NumberFormat("en-US");
  const formatDate = (date) => {
    //gio, phut, ngay, thang, nam
    return date.toLocaleString("vi-VN", {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    getPage(formData).then((data) => {
      setResponseData(data);
    });
    console.log("formData", formData);
  }, [formData]);

  return (
    <>
      <h1>Nhập hàng</h1>
      <Link to="create" className="btn btn-primary mb-3">
        Tạo phiếu nhập hàng
      </Link>
      {/* thanh tim kiem */}
      <div className="row">
        <div className="input-group mb-3 col">
          <span className="input-group-text">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm"
            onChange={(e) =>
              setFormData({ ...formData, q: e.target.value, page: 1 })
            }
            className="form-control"
          />
        </div>
        <DateRangePicker
          className="col"
          startDate={formData.startDate}
          endDate={formData.endDate}
          setStartDate={(startDate) => {
            setFormData({
              ...formData,
              startDate,
              page: 1,
            });
          }}
          setEndDate={(endDate) => {
            setFormData({
              ...formData,
              endDate,
              page: 1,
            });
          }}
        />
      </div>
      <div className="row mb-3">
        <div className="col">
          <select
            name="provider_id"
            className="form-select"
            onChange={(e) => {
              setFormData({
                ...formData,
                provider_id: e.target.value,
                page: 1,
              });
            }}
          >
            <option value="">Tất cả</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>
        <NumberRangeInput
          className="col"
          startNum={formData.startTotal}
          setStartNum={(startTotal) => {
            setFormData({
              ...formData,
              startTotal,
              page: 1,
            });
          }}
          endNum={formData.endTotal}
          setEndNum={(endTotal) => {
            setFormData({
              ...formData,
              endTotal,
              page: 1,
            });
          }}
        />
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th
              onClick={() =>
                setFormData({
                  ...formData,
                  orderBy: "receipt_id",
                  orderType:
                    formData.orderBy === "receipt_id" &&
                    formData.orderType === "asc"
                      ? "desc"
                      : "asc",
                })
              }
            >
              Mã phiếu <i className="fa-solid fa-sort"></i>
            </th>
            <th
              onClick={() => {
                setFormData({
                  ...formData,
                  orderBy: "createdAt",
                  orderType:
                    formData.orderBy === "createdAt" &&
                    formData.orderType === "asc"
                      ? "desc"
                      : "asc",
                });
              }}
            >
              Ngày tạo <i className="fa-solid fa-sort"></i>
            </th>
            <th>Nhà cung cấp</th>
            <th
              onClick={() => {
                setFormData({
                  ...formData,
                  orderBy: "total",
                  orderType:
                    formData.orderBy === "total" && formData.orderType === "asc"
                      ? "desc"
                      : "asc",
                });
              }}
            >
              Tổng tiền <i className="fa-solid fa-sort"></i>
            </th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {responseData.receipts.map((receipt) => (
            <tr key={receipt.receipt_id}>
              <td>{receipt.receipt_id}</td>
              <td>{formatDate(new Date(receipt.createdAt))}</td>
              <td>{receipt.provider.name}</td>
              <td>{numberFormatter.format(receipt.total)}</td>
              <td>
                <Link
                  to={`read/${receipt.receipt_id}`}
                  className="btn btn-warning text-decoration-none"
                >
                  Xem
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        page={formData.page}
        setPage={(page) => {
          setFormData({
            ...formData,
            page,
          });
        }}
        total_page={responseData.total_page}
      />
    </>
  );
}
