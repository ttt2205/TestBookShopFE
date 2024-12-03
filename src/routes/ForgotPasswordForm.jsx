import React, { useState } from "react";
import axios from "axios";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn không cho form reload trang

    try {
      setMessage(""); // Reset thông báo cũ
      setError(""); // Reset lỗi cũ

      // Gửi yêu cầu đến API để gửi email
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_END_LOCALHOST}/api/forgot-password`,
        { email }
      );

      setMessage("Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau."
      );
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Địa chỉ Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Gửi yêu cầu
        </button>
      </form>

      {/* Hiển thị thông báo thành công hoặc lỗi */}
      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default ForgotPasswordForm;
