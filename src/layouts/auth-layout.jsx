// Mise en page des pages sans sidebar (ex : connexion) : logo + contenu centré.
import logo from '@/assets/logo.png'
import './layouts.css'

export function AuthLayout({ children }) {
  return (
    <div className='auth-layout'>
      <div className='auth-layout__brand'>
        <img src={logo} alt='Shams El Djazair' />
        <span>Shams El Djazair</span>
      </div>
      {children}
    </div>
  )
}
