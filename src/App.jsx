// Toutes les routes de l'application (react-router-dom).
// Pour ajouter une page : créer le composant dans src/pages puis ajouter une <Route> ici.
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
// Context des notifications (Socket.IO)
import { NotificationsProvider } from '@/context/NotificationsContext'
// Mises en page
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
// Pages
import { Dashboard } from '@/pages/dashboard/Dashboard'
import { NotFoundError } from '@/pages/errors/NotFoundError'
import { SignIn } from '@/pages/sign-in/SignIn'
import { ChangePassword } from '@/pages/change-password/ChangePassword'
import { Produits } from '@/pages/products/Produits'
import Marque from './pages/marques/Marque'
import Devis from './pages/devis/Devis'
import Commande from './pages/commande/Commande'
import Category from './pages/categories/Category'
import Notification from './pages/notification/Notification'
import Clients from './pages/clients/Clients'
import Fournisseurs from './pages/fournisseurs/Fournisseurs'
import Entreprises from './pages/entreprises/Entreprises'
import AjouterEmploye from './pages/employes/AjouterEmploye'
import Employes from './pages/employes/Employes'
import Settings from './pages/settings/Settings'
import ClientsCommerciaux from './pages/clients-commerciaux/ClientsCommerciaux'

export default function App() {
  return (
    // Le Provider entoure toute l'application :
    // tous les composants à l'intérieur peuvent lire les notifications
    <NotificationsProvider>
      <BrowserRouter>
        <Routes>
          {/* ===== Page sans sidebar ===== */}
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/change-password' element={<ChangePassword />} />

          {/* ===== Pages avec les sidebars + header ===== */}
          <Route element={<AuthenticatedLayout />}>
            <Route path='/' element={<Dashboard />} />
            <Route path='/produits' element={<Produits />} />
            <Route path='/marques' element={<Marque />} />
            <Route path='/devis' element={<Devis />} />
            <Route path='/commande' element={<Commande />} />
            <Route path='/categorie' element={<Category />} />
            <Route path='/notification' element={<Notification />} />
            <Route path='/clients' element={<Clients />} />
            <Route path='/fournisseurs' element={<Fournisseurs />} />
            <Route path='/entreprises' element={<Entreprises />} />
            <Route path='/employes' element={<Employes />} />
            {/* paramètres du compte (ouverts depuis le menu profil du header) */}
            <Route path='/settings' element={<Settings />} />       {/*puisque elle est a l'interieur de AuthenticatedLayout elle va s'afficher avec le sidebar et tt mais pas d'icone de paramtre dans le sidebar    */}
            <Route path='/employes/ajouter' element={<AjouterEmploye />} />

            {/* même page, le status change (key pour repartir de zéro en changeant de page) */}
            <Route path='/clients-commerciaux' element={<ClientsCommerciaux key='client' status='client' />} />
            <Route path='/prospects' element={<ClientsCommerciaux key='prospect' status='prospect' />} />
          </Route>

          {/* ===== Page introuvable (404) ===== */}
          <Route path='*' element={<NotFoundError />} />
        </Routes>

        {/* Notifications (toast) */}
        <Toaster duration={5000} />
      </BrowserRouter>
    </NotificationsProvider>
  )
}