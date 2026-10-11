// Page de connexion : formulaire email + mot de passe.
import { useState } from 'react'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
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
import './sign-in.css'

export function SignIn() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { auth } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Veuillez saisir votre email et votre mot de passe.')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post('http://localhost:5001/auth/login', {
        email,
        password,
      })
      const { token } = response.data

      // token utilisé par les autres pages (Authorization: Bearer ...)
      localStorage.setItem('token', token)
      auth.setUser({ email })
      auth.setAccessToken(token)
      toast.success(`Bon retour, ${email} !`)

      // retourne à la page demandée avant la connexion, sinon à l'accueil
      navigate(searchParams.get('redirect') || '/', { replace: true })
    } catch (error) {
      // message renvoyé par l'API (utilisateur introuvable, mot de passe incorrect...)
      toast.error(error.response?.data?.message || 'Impossible de se connecter.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className='sign-in__card'>
        <CardHeader>
          <CardTitle>Se connecter</CardTitle>
          <CardDescription>
            Saisissez votre email et votre mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='sign-in__form'>
            <div className='sign-in__field'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='nom@exemple.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='sign-in__field'>
              <Label htmlFor='password'>Mot de passe</Label>
              <Input
                id='password'
                type='password'
                placeholder='********'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type='submit' disabled={loading}>Se connecter</Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
