import './App.css'
import SidebarGeneral from './components/sidebar/SidebarGeneral'
 
 
 
 

function App() {
  return (
    <div className="app-layout">
      <SidebarGeneral/>
      <main className="app-layout__content">
        {/* contenu des pages */}
      </main>
    </div>
  )
}

export default App
