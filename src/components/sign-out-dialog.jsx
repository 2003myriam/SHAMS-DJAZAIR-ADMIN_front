// Boîte de dialogue de déconnexion : vide la session et renvoie vers la connexion.
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { ConfirmDialog } from '@/components/confirm-dialog'

export function SignOutDialog({ open, onOpenChange }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { auth } = useAuthStore()

  const handleSignOut = () => {
    auth.reset()
    // Garde la page actuelle pour y revenir après la reconnexion
    const currentPath = location.pathname + location.search
    navigate(`/sign-in?redirect=${encodeURIComponent(currentPath)}`, {
      replace: true,
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Déconnexion'
      desc='Voulez-vous vraiment vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.'
      confirmText='Déconnexion'
      destructive
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
    />
  )
}
