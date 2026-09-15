import React from 'react'
import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
function Sidebar2({selected}) {
   console.log("SELECTED =", selected);
  const [active2, setActive2] = useState("Apercu");
  const MENU_ITEMS2 = [
    
      { key: "Apercu", label: "Apercu generale" ,  parent: "dashboard"},
      { key: "performance", label: "Performance" , parent: "dashboard" },
      { key: "produits", label: "Tous les produits" , parent: "products" },
      { key: "categorie", label: "Catégories" , parent: "products" },
      { key: "sous-categorie", label: "Sous-Catégories" , parent: "products" },
      { key: "marque", label: "Marques" , parent: "products" },
      { key: "commande", label: "Toutes les commandes" , parent: "orders" },
     
  ]
  return (
    <>
      <Sidebar>
        <Menu  >
          {MENU_ITEMS2.filter(item =>item.parent === selected).map((item) => (
              <MenuItem
              key={item.key}
              active={active2 === item.key}
              onClick={() => setActive2(item.key)}
              >
              <p>{item.label}</p>
              </MenuItem>
          ))}
        </Menu>
      </Sidebar>
    </>
  )

}

export default Sidebar2

 