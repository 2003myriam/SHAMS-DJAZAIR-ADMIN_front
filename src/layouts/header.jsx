// En-tête en haut des pages : bouton sidebar, barre de recherche (Ctrl+K), contenu de la page, bouton dark mode.
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export function Header({ children }) {
  return (
    <header className='header'>
      <SidebarTrigger variant='outline' />
      <Separator orientation='vertical' className='header__separator' />
      <Search />
      {/* contenu propre à la page (optionnel) */}
      <div className='header__content'>{children}</div>
      <ThemeSwitch />
    </header>
  )
}
