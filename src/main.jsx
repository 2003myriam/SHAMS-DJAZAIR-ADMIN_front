// Point d'entrée de l'application : active le thème (clair / sombre) puis affiche <App />.
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './context/theme-provider'
import App from './App'
// Styles globaux
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
)
