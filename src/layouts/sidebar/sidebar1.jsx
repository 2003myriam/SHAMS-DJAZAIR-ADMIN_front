// Sidebar d'icônes (Sidebar1) : logo, une icône par section et bouton de déconnexion.
import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
import logo from '@/assets/logo.png'
import { useSidebar } from '@/components/ui/sidebar'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { MENU_ITEMS } from '@/layouts/data/sidebar-data'
import './sidebar1.css'

// Sidebar d'icônes : choisit la section affichée dans Sidebar2
export function Sidebar1({ selected, setSelected }) {
  const { isMobile, setOpen, setOpenMobile } = useSidebar()
  const [signOutOpen, setSignOutOpen] = useState(false)

  const handleSelect = (key) => {
    setSelected(key)
    // ouvre Sidebar2 si elle était fermée
    if (isMobile) setOpenMobile(true)
    else setOpen(true)
  }

  return (
    <>
      <Sidebar
        className='app-sidebar'
        width='72px'
        backgroundColor='transparent'
      >
        <div className='app-sidebar__brand'>
          <img src={logo} alt='Shams El Djazair' />
        </div>

        <Menu className='app-sidebar__nav'>
          {MENU_ITEMS.map((item) => (
            <MenuItem
              key={item.key}
              icon={<item.icon size={21} />}
              active={selected === item.key}
              onClick={() => handleSelect(item.key)}
              data-label={item.label}
              aria-label={item.label}
              aria-current={selected === item.key ? 'page' : undefined}
            />
          ))}
        </Menu>

        <Menu className='app-sidebar__nav app-sidebar__nav--bottom'>
          <MenuItem
            className='app-sidebar__item--danger'
            icon={<LogOut size={21} />}
            onClick={() => setSignOutOpen(true)}
            data-label='Déconnexion'
            aria-label='Déconnexion'
          />
        </Menu>
      </Sidebar>

      <SignOutDialog open={signOutOpen} onOpenChange={setSignOutOpen} />
    </>
  )
}
