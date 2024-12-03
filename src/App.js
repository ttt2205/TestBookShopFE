// import "./assets/scss/App.scss";
import "./assets/scss/admin.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import * as React from "react";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import router from "./routes";
import ScrollToTopButton from "./components/ScrollToTopButton";
export default function App() {
  // let [user, setUser] = useState();

  // useEffect(() => {
  //   (async () => {
  //     const token = window.localStorage.getItem("token");
  //     //REST API respone
  //     const response = await loginWithToken(email, password);
  //     console.log(response);
  //     if (response.status === 200) {
  //       setUser(response.data.username);
  //       window.localStorage.setItem("token", response.data.token);
  //     }
  //   })();
  // }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ScrollToTopButton />   
      <ToastContainer />
    </>
  );
}
