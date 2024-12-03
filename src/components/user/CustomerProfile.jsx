import React, { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";
import axios from "axios";

import {
  getCustomerInfoByEmail,
  updateCustomerInfo,
} from "services/customerService";
import { Link } from "react-router-dom";

function CustomerProfile() {
  const auth = useAuth(); // Lấy thông tin auth từ context
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const response = await getCustomerInfoByEmail(
          auth.user.email,
          auth.token
        );
        const { firstName, lastName, email, phone_number } =
          response.data.customer;
        setUser({
          firstname: firstName,
          lastname: lastName,
          email: email,
          phoneNumber: phone_number,
        }); // Cập nhật dữ liệu người dùng
        setFormData(response.data); // Đồng bộ formData
      } catch (error) {
        console.error("Error fetching customer info:", error);
      }
    };
    fetchCustomerInfo();
  }, [auth]);

  useEffect(() => {
    console.log("user", user);
    setFormData(user); // Đồng bộ formData
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== "email") setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    try {
      const response = await updateCustomerInfo(formData, auth.tokenCustomer);
      setUser(formData); // Lưu thay đổi vào state chính
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating customer info:", error);
    }
  };

  const handleCancelClick = () => {
    setFormData(user); // Hoàn tác thay đổi
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h4>User Profile</h4>
        </div>
        <div className="card-body">
          <form>
            <div className="mb-3">
              <label htmlFor="firstname" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastname" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                disabled={!isEditing}
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
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </form>
        </div>
        <div className="card-footer">
          {!isEditing ? (
            <button className="btn btn-primary" onClick={handleEditClick}>
              Edit
            </button>
          ) : (
            <>
              <button
                className="btn btn-success me-2"
                onClick={handleSaveClick}
              >
                Save
              </button>
              <button className="btn btn-secondary" onClick={handleCancelClick}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
      {auth.user && auth.user.role.role_name === "Admin" && (
        <Link to="/dashboard" className="btn btn-primary mt-3">
          Go to Admin Dashboard
        </Link>
      )}
    </div>
  );
}

export default CustomerProfile;
