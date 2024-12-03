import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../components/admin/error-page";
import Index from "../components/admin/index";
import PrivateRoute from "./PrivateRoute";
import AuthProvider from "../context/AuthContext";
import LoginAdmin from "./LoginAdmin";
import LoginPage from "./LoginPage";
import RegisterForm from "./RegisterForm";
import CustomerOrders from "./CustomerOrders";
import Home from "./Home";
import CustomerProfile from "components/user/CustomerProfile";
import HomePage from "components/user/HomePageUser";
import UserProfile from "components/admin/UserProfile";
import Dashboard from "components/admin/Dashboard";
import ProductPanel from "components/admin/ProductPanel"; // loader as productLoader,
import EditProduct, {
  loader as editProductLoader,
  action as editProductAction,
} from "components/admin/EditProduct";
import AddProduct, {
  loader as addProductLoader,
  action as addProductAction,
} from "components/admin/AddProduct";
import NhapHangPanel, {
  loader as nhapHangLoader,
} from "components/admin/NhapHangPanel";
import ChiTietPhieuNhap, {
  loader as phieuNhapLoader,
} from "components/admin/ChiTietPhieuNhap";
import ThemPhieuNhap, {
  loader as themPhieuNhapLoader,
  action as createPhieuNhapAction,
} from "components/admin/ThemPhieuNhap";

import DetailProductPage from "./DetailProductPage";
import ShoppingCart from "./ShoppingCart";
import ShoppingTrends from "components/user/ShoppingTrends";
import AdvancedSearch from "context/advancedSearch";
import AccountPanel, {
  loader as accountsLoader,
} from "components/admin/AccountPanel";
import ThongKe, { navs as thongKeNavs } from "components/admin/thongke/index";
import OderConfirmation, {
  loader as oderConfirmationLoader,
} from "components/admin/OderConfirmation";
import Promotions from "components/admin/promotion";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard",
        element: <PrivateRoute />,
        errorElement: <ErrorPage />,
        children: [
          {
            element: <Dashboard />,
            errorElement: <ErrorPage />,
            children: [
              {
                errorElement: <ErrorPage />,
                children: [
                  {
                    index: true,
                    element: <Index />,
                  },
                  {
                    path: "products",
                    element: <ProductPanel />,
                    errorElement: <ErrorPage />,
                  },
                  {
                    path: "products/edit/:productId",
                    element: <EditProduct />,
                    errorElement: <ErrorPage />,
                    loader: editProductLoader,
                    action: editProductAction,
                  },
                  {
                    path: "products/add",
                    element: <AddProduct />,
                    errorElement: <ErrorPage />,
                    loader: addProductLoader,
                    action: addProductAction,
                  },
                  {
                    path: "purchase",
                    element: <NhapHangPanel />,
                    loader: nhapHangLoader,
                    errorElement: <ErrorPage />,
                  },
                  {
                    path: "purchase/read/:receiptId",
                    element: <ChiTietPhieuNhap />,
                    loader: phieuNhapLoader,
                    errorElement: <ErrorPage />,
                  },
                  {
                    path: "purchase/create",
                    loader: themPhieuNhapLoader,
                    action: createPhieuNhapAction,
                    element: <ThemPhieuNhap />,
                    errorElement: <ErrorPage />,
                  },
                  {
                    path: "thongke",
                    element: <ThongKe />,
                    errorElement: <ErrorPage />,
                    children: [
                      {
                        index: true,
                        element: <div>Thống kê</div>,
                      },
                      ...thongKeNavs,
                    ],
                  },
                  {
                    path: "accounts",
                    element: <AccountPanel />,
                    loader: accountsLoader,
                    errorElement: <ErrorPage />,
                  },
                  {
                    path: "sales",
                    element: <OderConfirmation />,
                    errorElement: <ErrorPage />,
                    loader: oderConfirmationLoader,
                  },
                  {
                    path: "promotions",
                    element: <Promotions />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/user-login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterForm />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordForm />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordForm />,
      },
      {
        path: "/",
        element: <Home />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "profile",
            //dang xai tam cua admin, sau nay thi tao cai khac va dung loader de tai du lieu
            element: <CustomerProfile />,
          },
          {
            path: "detail-product/:productId/:productName",
            element: <DetailProductPage />,
          },
          {
            path: "cart",
            element: <ShoppingCart />,
          },
          {
            path: "order",
            element: <CustomerOrders />,
          },
          {
            path: "shopping-trends",
            element: <ShoppingTrends />,
          },
          {
            path: "products",
            element: <AdvancedSearch />,
          },
        ],
      },
    ],
  },
]);

export default router;
