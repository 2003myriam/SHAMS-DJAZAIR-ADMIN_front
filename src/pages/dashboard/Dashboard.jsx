// Page d'accueil "/" : affiche pour l'instant la page des produits.
// Attention : <Produits /> contient déjà son <Header /> et son <Main>,
// il ne faut donc pas les rajouter ici (sinon le header s'affiche deux fois).
import './dashboard.css'
import { Produits } from '../products/Produits'

export function Dashboard() {
  return <Produits />
}
