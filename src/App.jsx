// Toutes les routes de l'application (react-router-dom).
// Pour ajouter une page : créer le composant dans src/pages puis ajouter une <Route> ici.
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
// Mises en page
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
// Pages
import { Dashboard } from '@/pages/dashboard/Dashboard'
import { NotFoundError } from '@/pages/errors/NotFoundError'
import { SignIn } from '@/pages/sign-in/SignIn'
import { Produits } from '@/pages/products/Produits'
import Marque from './pages/marques/Marque'
import Devis from './pages/devis/Devis'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== Page sans sidebar ===== */}
        <Route path='/sign-in' element={<SignIn />} />

        {/* ===== Pages avec les sidebars + header ===== */}
        <Route element={<AuthenticatedLayout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/produits' element={<Produits />} />
          <Route path='/marques' element={<Marque />} />
          <Route path='/devis' element={<Devis />} />
        </Route>

        {/* ===== Page introuvable (404) ===== */}
        <Route path='*' element={<NotFoundError />} />
      </Routes>

      {/* Notifications (toast) */}
      <Toaster duration={5000} />
    </BrowserRouter>
  )
}
