// Page 404 : affichée quand l'URL ne correspond à aucune page.
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import './errors.css'

export function NotFoundError() {
  const navigate = useNavigate()
  return (
    <div className='not-found'>
      <h1 className='not-found__code'>404</h1>
      <p className='not-found__title'>Oups ! Page introuvable !</p>
      <p className='not-found__text'>
        La page que vous cherchez n'existe pas ou a été supprimée.
      </p>
      <div className='not-found__actions'>
        <Button variant='outline' onClick={() => navigate(-1)}>
          Retour
        </Button>
        <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
      </div>
    </div>
  )
}
