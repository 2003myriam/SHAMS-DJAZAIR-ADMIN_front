// Sidebar d'icônes (Sidebar1) : logo et une icône par section.
// (la déconnexion est dans le menu profil du header)
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
import logo from '@/assets/logo.png'
import { useSidebar } from '@/components/ui/sidebar'
import { MENU_ITEMS } from '@/layouts/data/sidebar-data'
import { usePermission } from '@/hooks/usePermission'
import './sidebar1.css'

// Sidebar d'icônes : choisit la section affichée dans Sidebar2
export function Sidebar1({ selected, setSelected, totalCommandes }) {
  const { isMobile, setOpen, setOpenMobile } = useSidebar()
  // la section Employés n'est visible que pour ceux qui peuvent créer un employé (admin)
  const canCreateEmployee = usePermission('employees', 'create')
  const menuItems = MENU_ITEMS.filter((item) => item.key !== 'Employees' || canCreateEmployee)

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
          {menuItems.map((item) => (
            <MenuItem
              key={item.key}
              icon={<item.icon size={21} />}
              active={selected === item.key}
              onClick={() => handleSelect(item.key)}
              data-label={item.label}
              aria-label={item.label}
              aria-current={selected === item.key ? 'page' : undefined}
            >
              {item.key === 'Orders' && totalCommandes > 0 && (
                <span className="notification-badge">{totalCommandes}</span>
              )}
            </MenuItem>
          ))}
        </Menu>
      </Sidebar>
    </>
  )
}
