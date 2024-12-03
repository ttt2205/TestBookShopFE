import { useAuth } from "../context/AuthContext";
import React from "react";
import { Link, Navigate, Outlet, Route } from "react-router-dom";
import ErrorPage from "../components/admin/error-page";
import LogoutButton from "../components/LogoutButton";

export const PrivateRoute = () => {
  const { token, user, isLoading } = useAuth();
  if (user && user.role.role_name === "Admin") {
    return <Outlet />;
  }
  if (isLoading) return <div>Loading...</div>;
  return <Navigate to="/" />;
  // return (
  //   <ErrorPage
  //     otherError={{ message: "You are not admin!" }}
  //     children={
  //       <div className="d-flex gap-3">
  //         <Link className="btn btn-primary" to="/">
  //           Home Page
  //         </Link>
  //         <LogoutButton />
  //       </div>
  //     }
  //   />
  // );
};

export default PrivateRoute;
