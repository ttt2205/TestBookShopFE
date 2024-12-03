import { NavLink } from "react-router-dom";
import LuotTruyCapChart from "../charts/LuotTruyCapChart";
import XuHuongChart from "../charts/XuHuongChart";
import DoanhThuChart from "../charts/DoanhThuChart";

export const navs = [
  {
    path: "trending",
    name: "Xu hướng",
    element: <XuHuongChart />,
  },
  {
    path: "revenue",
    name: "Doanh thu",
    element: <DoanhThuChart />,
  },
  {
    path: "accession",
    name: "Lượt truy cập",
    element: <LuotTruyCapChart />,
  },
];

export default function Navbar() {
  // const navs = ["Số lượng nhập", "Doanh thu", "Lượt truy cập"];

  return (
    <>
      <nav className="w-100 d-flex flex-column">
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          {navs.map(({ name, path }) => (
            <div className="nav-item" key={name}>
              <NavLink
                to={`${path}`}
                className="nav-link text-dark"
                activeclassname="active"
              >
                {name}
              </NavLink>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
