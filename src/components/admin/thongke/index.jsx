import { Outlet } from "react-router-dom";
import Navbar, { navs } from "./navbar";

export default function ThongKe() {
  return (
    <div className="w-100 bg-light">
      <Navbar />
      <div className="p-3">
        <Outlet />
      </div>
    </div>
  );
}

export { navs };
