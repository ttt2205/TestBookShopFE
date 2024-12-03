import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const auth = useAuth();
  return (
    <button onClick={() => auth.logOut()} className="btn-submit" type="button">
      logout
    </button>
  );
};

export default LogoutButton;
