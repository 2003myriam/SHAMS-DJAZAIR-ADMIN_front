// En-tête en haut des pages : bouton sidebar, barre de recherche (Ctrl+K), contenu de la page, bouton dark mode.
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CiBellOn } from "react-icons/ci";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useNotifications } from '@/context/NotificationsContext'

export function Header({ children }) {
  const notifications = useNotifications()
  return (
    <header className='header'>
      <SidebarTrigger variant='outline' />
      <Separator orientation='vertical' className='header__separator' />
      <Search />
      {/* Notification */}
      <Popover>
        <PopoverTrigger ><CiBellOn /></PopoverTrigger> {/*  on clique sur la cloche on obtiens les notifs */}
        {notifications.length > 0 && <p> {notifications.length} </p>}
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Notifications</PopoverTitle>
            <PopoverDescription>
              Voici les notifications reçues.
            </PopoverDescription>
          </PopoverHeader>

          {notifications.map((notification, index) => (
            <div key={index}>
              <p>{notification.type}</p>
              <p>{notification.message}</p>
            </div>
          ))}
        </PopoverContent>
      </Popover>
      {/* contenu propre à la page (optionnel) */}
      <div className='header__content'>{children}</div>
      <ThemeSwitch />
    </header>
  )
}
