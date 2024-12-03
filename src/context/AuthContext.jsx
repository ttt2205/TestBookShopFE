import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { login, loginWithToken } from "services/authServices";
import { toast } from "react-toastify";

const AuthContext = createContext({});

const AuthProvider = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const loginAction = async (data) => {
    try {
      setIsLoading(true);
      const response = await login(data.username, data.password);
      // console.log(response);
      if (response.data) {
        if (response.data.user) {
          toast.success(response.data.message);
          setUser(response.data.user);
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/dashboard");
          return;
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const loginFromLocal = async () => {
    try {
      setIsLoading(true);
      //get user from local storage
      const token = localStorage.getItem("token") || "";
      let data = await loginWithToken(token);
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setToken(data.token);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // navigate("/login");
        //neu location la dashboard thi moi chuyen ve login
        if (location.pathname.includes("/dashboard")) {
          navigate("/login");
        }
      }
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  let hasRun = false;
  useEffect(() => {
    if (hasRun) return; // Ngăn chạy lần thứ hai
    hasRun = true;
    (async () => {
      try {
        await loginFromLocal();
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loginAction,
        logOut,
        isLoading,
      }}
    >
      <Outlet />
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext); //tra ve value cua authcontext
};
