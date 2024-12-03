import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  // Lấy query params
  const [searchParams] = useSearchParams();
  // Lấy giá trị của 'token'
  const token = searchParams.get("token");

  useEffect(() => {
    console.log("token", token);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Mật khẩu và mật khẩu xác nhận không khớp!");
      return;
    }

    const fetchUpdatePassword = async (token) => {
      try {
        // Gửi yêu cầu đến API để gửi update password
        const response = await axios.post(
          `${process.env.REACT_APP_BACK_END_LOCALHOST}/api/forgot-password/reset-password`,
          { token, password }
        );
        console.log("respone", response);
        if (response && response.data.error === 0) {
          // Thực hiện yêu cầu đổi mật khẩu (gửi tới API)
          setMessage(response.data.message);
          navigate("/login");
        } else {
          setMessage(response.data.message);
          navigate("/forgot-password");
        }
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Có lỗi xảy ra. Vui lòng thử lại sau."
        );
      }
    };
    fetchUpdatePassword(token);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-light w-100"
      style={{ margin: "auto" }}
    >
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h4 className="text-center mb-3">Đặt lại mật khẩu</h4>
        {message && (
          <div
            className={`alert ${
              message.includes("không khớp") ? "alert-danger" : "alert-success"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Cập nhật mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
