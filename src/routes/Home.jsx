import React from "react";
import Header from "components/user/Header";
import Footer from "components/user/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
const Home = () => {
  const { user } = useAuth();
  const navgate = useNavigate();

  return (
    <>
      {user?.role?.role_name === "Admin" ? (
        navgate("/dashboard")
      ) : (
        <div className="page-wrapper m-auto">
          <Header />
          <Outlet />
          <Footer />
        </div>
      )}
    </>
  );
};

export default Home;
