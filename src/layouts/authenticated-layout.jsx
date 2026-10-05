// Mise en page principale : les 2 sidebars à gauche et la page affichée à droite.
import { Outlet } from 'react-router-dom'
import { getCookie } from '@/lib/cookies'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SidebarGeneral } from '@/layouts/sidebar/sidebar-general'
import './layouts.css'

export function AuthenticatedLayout() {
  // état ouvert / fermé de la sidebar, mémorisé dans un cookie
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  return (
    // SearchProvider : menu de recherche (Ctrl+K)
    // SidebarProvider : ouverture / fermeture de la sidebar (bouton du header, Ctrl+B)
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen} className='app-layout'>
        <SidebarGeneral />
        {/* la page de la route actuelle s'affiche ici */}
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </SearchProvider>
  )
}
