// Page de connexion : formulaire email + mot de passe.
// La connexion est simulée : à remplacer par l'appel à votre API.
import { useState } from 'react'
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Veuillez saisir votre email et votre mot de passe.')
      return
    }

    // TODO : appeler votre API ici (ex : axios.post('/api/login', { email, password }))
    auth.setUser({ email })
    auth.setAccessToken('mock-access-token')
    toast.success(`Bon retour, ${email} !`)

    // retourne à la page demandée avant la connexion, sinon à l'accueil
    navigate(searchParams.get('redirect') || '/', { replace: true })
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
            <Button type='submit'>Se connecter</Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
