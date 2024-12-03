import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRegisterCustomer } from "services/customerService";

function RegisterForm() {
  const navigate = useNavigate();
  // State để lưu trữ giá trị của các trường input
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Hàm xử lý sự kiện thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm xử lý khi form được submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData); // In ra các giá trị của các trường input
    const resRegister = await postRegisterCustomer(formData);
    console.log(resRegister); // In ra các giá trị của các trường input
    navigate("/login");
  };

  return (
    <div className="container mt-5 w-50">
      <h2 className="text-center">Đăng Ký Tài Khoản</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">
            Tên
          </label>
          <input
            type="text"
            className="form-control"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">
            Họ
          </label>
          <input
            type="text"
            className="form-control"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone_number" className="form-label">
            Số Điện Thoại
          </label>
          <input
            type="tel"
            className="form-control"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Mật Khẩu
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Xác Nhận Mật Khẩu
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="agree"
            name="agree"
            required
          />
          <label className="form-check-label" htmlFor="agree">
            Tôi đồng ý với các điều khoản và điều kiện
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Đăng Ký
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
