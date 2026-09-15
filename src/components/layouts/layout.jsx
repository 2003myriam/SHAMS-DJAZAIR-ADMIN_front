import React from 'react'
import NavBar from '../NavBar/NavBar'
import SidebarGeneral from '../sidebar/SidebarGeneral'

function Layout({ children }) {
  return (
    <div className="app-layout">
      <SidebarGeneral/>
      <div className="app-layout__main">
        <NavBar/>
        {children}
      </div>
    </div>
  )
}

export default Layout