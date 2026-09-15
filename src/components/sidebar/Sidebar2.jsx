import React from 'react'
import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { LuStepBack } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import "./sidebar2.css";
import { Link } from 'react-router-dom';
function Sidebar2({selected}) {
 
  const [active2, setActive2] = useState("Apercu");
  // ouverture et fermuture de menu
  const [open, setOpen] = useState(true);
  const closeMenu=()=>{
    setOpen(!open)
  }
  const MENU_ITEMS2 = [
    
      { key: "Apercu", label: "Apercu generale" ,  parent: "dashboard" ,path: "/dashboard"},
      { key: "performance", label: "Performance" , parent: "dashboard" },
      { key: "produits", label: "Tous les produits" , parent: "products" },
      { key: "categorie", label: "Catégories" , parent: "products" },
      { key: "sous-categorie", label: "Sous-Catégories" , parent: "products" },
      { key: "marque", label: "Marques" , parent: "products" , path: "/marques" },
      { key: "commande", label: "Toutes les commandes" , parent: "orders" },
     
  ]
  return (
    <>
      <Sidebar className="app-sidebar2" collapsed={!open}>
        {/* barre de recherche  */}
        <Menu>
          <CiSearch />
          <MenuItem><input type="text" /></MenuItem>
        </Menu>
        {/* le sidebar */}
        <Menu className="app-sidebar2__nav" >
          {MENU_ITEMS2.filter(item =>item.parent === selected).map((item) => (
              <MenuItem
              key={item.key}
              active={active2 === item.key}
              onClick={() => setActive2(item.key)}
              component={item.path ? <Link to={item.path} /> : undefined}
              >
              <p>{item.label}</p>
              </MenuItem>
          ))}
        </Menu>
        {/* icone de fermeture de sidebar */}
        <LuStepBack  onClick={closeMenu}/>
      </Sidebar>
    </>
  )

}

export default Sidebar2

 