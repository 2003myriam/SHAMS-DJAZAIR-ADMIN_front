// Page de changement du mot de passe temporaire (première connexion d'un employé).
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/layouts/auth-layout'
import { ShieldCheck } from 'lucide-react'
import '../sign-in/sign-in.css'
import './ChangePassword.css'

export function ChangePassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/employee/change-password`,
        { password, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success(response.data.message || 'Mot de passe modifié avec succès.')
      // mot de passe changé : accès au dashboard
      navigate('/', { replace: true })
    } catch (error) {
      // message renvoyé par l'API (mots de passe différents, champ vide...)
      toast.error(error.response?.data?.message || 'Impossible de modifier le mot de passe.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className='sign-in__card'>
        <CardHeader>
          {/* icône de sécurité */}
          <div className='change-password__icon'>
            <ShieldCheck />
          </div>
          <CardTitle>Sécurisez votre compte</CardTitle>
          <CardDescription>
            Pour continuer, veuillez remplacer votre mot de passe temporaire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='sign-in__form'>
            <div className='sign-in__field'>
              <Label htmlFor='password'>Nouveau mot de passe</Label>
              <Input
                id='password'
                type='password'
                placeholder='Saisissez votre nouveau mot de passe'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className='sign-in__field'>
              <Label htmlFor='confirmPassword'>Confirmer le nouveau mot de passe</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Confirmez votre nouveau mot de passe'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type='submit' disabled={loading}>Modifier mon mot de passe</Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
