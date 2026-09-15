import React from 'react'
import './NavBar.css'

function NavBar() {
  return (
    <nav className="navbar">
      <input className="navbar__search" type="text" placeholder="Rechercher..." />
    </nav>
  )
}

export default NavBar