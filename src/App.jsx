import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/layouts/layout'
import Marque from './pages/Marques/Marque'
import Categorie from './pages/Categories/Categorie'
 
 
 
 
 

function App() {
  return (
    <Layout>
      <main className="app-layout__content">
        {/* contenu des pages */}
         <Routes>
          <Route path="/marques" element={<Marque/>} />
          <Route path="/categories" element={<Categorie/>} />
         </Routes>
      </main>
    </Layout>
  )
}

export default App
