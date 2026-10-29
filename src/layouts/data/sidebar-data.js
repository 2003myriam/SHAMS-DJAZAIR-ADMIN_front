// Données des sidebars : les sections (icônes) et les liens de chaque section.
// Pour ajouter un lien : l'ajouter dans MENU_ITEMS2 avec le bon "parent".
import { LayoutDashboard } from 'lucide-react'
import { AiOutlineProduct } from 'react-icons/ai'
import { FiFileText, FiUsers } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa";
// Sidebar 1 : les icônes (une icône = une section)
export const MENU_ITEMS = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { key: 'Products', label: 'Produits', icon: AiOutlineProduct },
  { key: 'Orders', label: 'Commande', icon: FiFileText },
  { key: 'Clients', label: 'Clients', icon: FiUsers },
  { key: 'Notifications', label: 'Notification', icon: FaRegBell },
]

// Sidebar 2 : les liens de la section sélectionnée (parent = key de MENU_ITEMS)
export const MENU_ITEMS2 = [
  { key: 'apercu', label: 'Aperçu général', parent: 'dashboard', path: '/' },
  // PARENT PRODUIT
  {key: 'Products', label: 'Tous les produits',parent: 'Products',path: '/produits',},
  {key: 'Brands', label: 'Toutes les marques',parent: 'Products',path: '/marques',},
  {key: 'Categories', label: 'Toutes les catégories',parent: 'Products',path: '/categorie',},
  // PARENT commande
  {key: 'Orders', label: 'Toutes les commandes',parent: 'Orders',path: '/commande',},
  {key: 'quote', label: 'Demande de devis',parent: 'Orders',path: '/devis',},
  // PARENT client
  {key: 'Clients', label: 'Tous les clients',parent: 'Clients',path: '/clients',},
  // PARENT notification
  {key: 'Notifications', label: 'Toutes les notifications',parent: 'Notifications',path: '/notification',},
 
]

// Retourne le lien correspondant à l'URL actuelle (le plus précis)
export function findActiveItem(pathname) {
  return MENU_ITEMS2.filter(
    (item) =>
      item.path === pathname ||
      (item.path !== '/' && pathname.startsWith(item.path + '/'))
  ).sort((a, b) => b.path.length - a.path.length)[0]
}
