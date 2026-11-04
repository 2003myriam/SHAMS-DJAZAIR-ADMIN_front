// Assemble les 2 sidebars : la section choisie dans Sidebar1 décide des liens affichés dans Sidebar2.
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { findActiveItem } from '@/layouts/data/sidebar-data'
import { Sidebar1 } from './sidebar1'
import { Sidebar2 } from './sidebar2'
import axios from 'axios'
import { toast } from 'sonner'
import { useUnreadRefresh } from '@/context/NotificationsContext'

export function SidebarGeneral() {
  const { pathname } = useLocation()
  // section affichée dans Sidebar2 (au départ : celle de la page actuelle)
  const [selected, setSelected] = useState(
    () => findActiveItem(pathname)?.parent ?? 'dashboard'
  )
  // Récuperation de toutes les notifiations afin de pouvoir mettre les chiffre evant chaque type de notif
  const [notifications, setNotifications] = useState([])
  // change quand une notification est lue / non lue ou qu'une nouvelle arrive
  const { unreadVersion } = useUnreadRefresh()
  const getNotifications = async () => {
    try {
      // seulement les non lues, avec une grande limite (la route est paginée à 12 par défaut)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/notification`, {
        params: { isRead: false, limit: 1000 }
      })
      setNotifications(response.data.data || [])
    } catch (error) {
      toast.error("Impossible de récupérer les notifications.")
    }
  }

  // rechargé au départ puis à chaque changement
  useEffect(() => {
    getNotifications()
  }, [unreadVersion])
  // Compteur des notif 
  const commandesCount = notifications.filter(notife => notife.type === "commande" && notife.isRead === false).length
  const devisCount = notifications.filter(notife => notife.type === "devis" && notife.isRead === false).length
  const totalCommandes = commandesCount + devisCount
  return (
    <>
      {/* Sidebar1 reçoit la fonction pour modifier selected */}
      <Sidebar1 selected={selected} setSelected={setSelected} totalCommandes={totalCommandes} />
      {/* Sidebar2 reçoit la valeur actuelle */}
      <Sidebar2 selected={selected} commandesCount={commandesCount} devisCount={devisCount} />
    </>
  )
}
