// Page Aperçu général (page d'accueil "/") : page vide, prête à recevoir votre contenu.
// Sert de modèle : copiez ce dossier pour créer une nouvelle page.
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import './dashboard.css'

export function Dashboard() {
  return (
    <>
      <Header />

      <Main>
        <h1 className='dashboard__title'>Aperçu général</h1>
        {/* Ajoutez le contenu de la page ici */}
      </Main>
    </>
  )
}
