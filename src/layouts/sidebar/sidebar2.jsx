// Sidebar de texte (Sidebar2) : recherche + liens de la section choisie dans Sidebar1.
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
import { Link, useLocation } from 'react-router-dom'
import { useSidebar } from '@/components/ui/sidebar'
import { findActiveItem, MENU_ITEMS2 } from '@/layouts/data/sidebar-data'
import './sidebar2.css'

// Sidebar de texte : liens de la section choisie dans Sidebar1
export function Sidebar2({ selected }) {
  const { pathname } = useLocation()
  // ouverture / fermeture gérées par le SidebarProvider
  // (bouton du header, Ctrl+B)
  const { open, openMobile, isMobile, setOpenMobile } = useSidebar()
  const [search, setSearch] = useState('')

  const active = findActiveItem(pathname)?.key
  const isOpen = isMobile ? openMobile : open

  const items = MENU_ITEMS2.filter((item) => item.parent === selected).filter(
    (item) => item.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Sidebar
      className='app-sidebar2'
      collapsed={!isOpen}
      collapsedWidth='0px'
      width='220px'
    >
      {/* barre de recherche */}
      <Menu>
        <Search size={17} />
        <MenuItem>
          <input
            type='text'
            placeholder='Rechercher...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </MenuItem>
      </Menu>

      {/* le sidebar */}
      <Menu className='app-sidebar2__nav'>
        {items.map((item) => (
          <MenuItem
            key={item.key}
            active={active === item.key}
            component={<Link to={item.path} />}
            onClick={() => isMobile && setOpenMobile(false)}
          >
            <p>{item.label}</p>
          </MenuItem>
        ))}
      </Menu>
    </Sidebar>
  )
}
