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
import '@/context/notifications.css'
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Header({ children }) {
  const notifications = useNotifications()
  return (
    <header className='header'>
      <SidebarTrigger variant='outline' />
      <Separator orientation='vertical' className='header__separator' />
      <Search />
      {/* contenu propre à la page (optionnel) */}
      <div className='header__content'>{children}</div>
      {/* Notification */}
      <Popover>
        <PopoverTrigger className='notif-bell'><CiBellOn /></PopoverTrigger> {/*  on clique sur la cloche on obtiens les notifs */}
        {notifications.length > 0 && <p className='notif-badge'> {notifications.length} </p>}
        <PopoverContent align='end' className='notif-popover'>
          <PopoverHeader className='notif-header'>
            <PopoverTitle className='notif-title'>Notifications</PopoverTitle>
            <PopoverDescription className='notif-description'>
              Voici les notifications reçues.
            </PopoverDescription>
          </PopoverHeader>

          {notifications.map((notification, index) => (
            <div key={index} className='notif-item'>
              <p className='notif-item__type'>{notification.type}</p>
              <p className='notif-item__message'>{notification.message}</p>
            </div>
          ))}
          <Link to="/notification" className='notif-footer'>
            Ouvrir le centre de notification <ArrowRight />
          </Link>
        </PopoverContent>

      </Popover>
      <ThemeSwitch />
    </header>
  )
}
