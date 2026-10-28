// Assemble les 2 sidebars : la section choisie dans Sidebar1 décide des liens affichés dans Sidebar2.
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { findActiveItem } from '@/layouts/data/sidebar-data'
import { Sidebar1 } from './sidebar1'
import { Sidebar2 } from './sidebar2'
import axios from 'axios'
import { toast } from 'sonner'

export function SidebarGeneral() {
  const { pathname } = useLocation()
  // section affichée dans Sidebar2 (au départ : celle de la page actuelle)
  const [selected, setSelected] = useState(
    () => findActiveItem(pathname)?.parent ?? 'dashboard'
  )
  // Récuperation de toutes les notifiations afin de pouvoir mettre les chiffre evant chaque type de notif
  const [notifications, setNotifications] = useState([])
  const getNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:5001/notification")
      setNotifications(response.data.data || [])
    } catch (error) {
      toast.error("Impossible de récupérer les notifications.")
    }
  }

  useEffect(() => {
    getNotifications()
  }, [])
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
