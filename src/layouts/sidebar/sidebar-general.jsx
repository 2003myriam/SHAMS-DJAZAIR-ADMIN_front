// Assemble les 2 sidebars : la section choisie dans Sidebar1 décide des liens affichés dans Sidebar2.
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { findActiveItem } from '@/layouts/data/sidebar-data'
import { Sidebar1 } from './sidebar1'
import { Sidebar2 } from './sidebar2'

export function SidebarGeneral() {
  const { pathname } = useLocation()
  // section affichée dans Sidebar2 (au départ : celle de la page actuelle)
  const [selected, setSelected] = useState(
    () => findActiveItem(pathname)?.parent ?? 'dashboard'
  )

  return (
    <>
      {/* Sidebar1 reçoit la fonction pour modifier selected */}
      <Sidebar1 selected={selected} setSelected={setSelected} />
      {/* Sidebar2 reçoit la valeur actuelle */}
      <Sidebar2 selected={selected} />
    </>
  )
}
