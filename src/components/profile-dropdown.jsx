// Menu du profil dans le header : avatar de l'utilisateur connecté,
// accès aux paramètres du profil et déconnexion.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { useAuthStore } from '@/stores/auth-store'

// Libellés en français des rôles
const ROLES = {
  admin: 'Administrateur',
  sales_manager: 'Responsable commercial',
  sales: 'Commercial',
  engineer: 'Ingénieur',
}

export function ProfileDropdown() {
  const { auth } = useAuthStore()
  const [signOutOpen, setSignOutOpen] = useState(false)

  const email = auth.user?.email || ''
  const role = auth.user?.role
  // initiales : les 2 premières lettres de l'email
  const initials = email.slice(0, 2).toUpperCase() || '?'

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className='profile__trigger' aria-label='Menu du profil'>
          {initials}
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='profile__menu'>
          {/* qui est connecté */}
          <DropdownMenuLabel className='profile__label'>
            <p className='profile__email'>{email}</p>
            <p className='profile__role'>{ROLES[role] || role}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* paramètres du profil */}
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to='/change-password'>
                <KeyRound />
                Changer le mot de passe
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          {/* déconnexion */}
          <DropdownMenuItem variant='destructive' onClick={() => setSignOutOpen(true)}>
            <LogOut />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={signOutOpen} onOpenChange={setSignOutOpen} />
    </>
  )
}
