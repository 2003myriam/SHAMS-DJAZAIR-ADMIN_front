import React, { useState } from 'react'
import Sidebarfunction from './Sidebar1'
import Sidebar2 from './Sidebar2'

function SidebarGeneral() {
    const [selected, setSelected] = useState("dashboard");
  return (
    <section className="app-layout">
       <Sidebarfunction  setSelected={setSelected}/> {/*  Sidebar1 reçoit la fonction pour modifier selected. */}
       <Sidebar2 selected={selected}/>  {/*Sidebar2 reçoit la valeur actuelle. */}
     </section>
    
  )
}

export default SidebarGeneral