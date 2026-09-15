import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import logo from "../../assets/logo.png";
import { LuLayoutDashboard, LuLogOut } from "react-icons/lu";
import { AiOutlineProduct } from "react-icons/ai";
import { FiShoppingBag, FiUsers } from "react-icons/fi";
import "./sidebar1.css";

const MENU_ITEMS = [
  { key: "dashboard", label: "Tableau de bord", icon: <LuLayoutDashboard /> },
  { key: "products", label: "Produits", icon: <AiOutlineProduct /> },
  { key: "orders", label: "Commandes", icon: <FiShoppingBag /> },
  { key: "clients", label: "Clients", icon: <FiUsers /> },
];

function Sidebarfunction({setSelected}) {
  const [active1, setActive1] = useState("dashboard");

  return (
    <Sidebar className="app-sidebar" width="72px" backgroundColor="transparent">
      <div className="app-sidebar__brand">
        <img src={logo} alt="Shams El Djazair" />
      </div>

      <Menu className="app-sidebar__nav">
        {MENU_ITEMS.map((item) => (
          <MenuItem
            key={item.key}
            icon={item.icon}
            active={active1 === item.key}
            onClick={() => {
              setActive1(item.key) ;
              setSelected(item.key) ; 
            }}
            data-label={item.label}
            aria-current={active1 === item.key ? "page" : undefined}
          />
        ))}
      </Menu>

      <Menu className="app-sidebar__nav app-sidebar__nav--bottom">
        <MenuItem
          className="app-sidebar__item--danger"
          icon={<LuLogOut />}
          data-label="Déconnexion"
          aria-label="Déconnexion"
        />
      </Menu>
    </Sidebar>
  );
}

export default Sidebarfunction;
