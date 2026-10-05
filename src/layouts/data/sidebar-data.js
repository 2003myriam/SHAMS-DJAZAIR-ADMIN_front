// Données des sidebars : les sections (icônes) et les liens de chaque section.
// Pour ajouter un lien : l'ajouter dans MENU_ITEMS2 avec le bon "parent".
import { LayoutDashboard, ListTodo } from 'lucide-react'
import { AiOutlineProduct } from 'react-icons/ai'

// Sidebar 1 : les icônes (une icône = une section)
export const MENU_ITEMS = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { key: 'tasks', label: 'Tâches', icon: ListTodo },
  { key: 'Products', label: 'Produits', icon: AiOutlineProduct },
]

// Sidebar 2 : les liens de la section sélectionnée (parent = key de MENU_ITEMS)
export const MENU_ITEMS2 = [
  { key: 'apercu', label: 'Aperçu général', parent: 'dashboard', path: '/' },
  { key: 'tasks', label: 'Toutes les tâches', parent: 'tasks', path: '/tasks' },
  {
    key: 'Products',
    label: 'Tous les produits',
    parent: 'Products',
    path: '/produits',
  },
]

// Retourne le lien correspondant à l'URL actuelle (le plus précis)
export function findActiveItem(pathname) {
  return MENU_ITEMS2.filter(
    (item) =>
      item.path === pathname ||
      (item.path !== '/' && pathname.startsWith(item.path + '/'))
  ).sort((a, b) => b.path.length - a.path.length)[0]
}
