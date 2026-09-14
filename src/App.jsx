import './App.css'
import Sidebarfunction from './components/sidebar/Sidebar1'

function App() {
  return (
    <div className="app-layout">
      <Sidebarfunction />
      <main className="app-layout__content">
        {/* contenu des pages */}
      </main>
    </div>
  )
}

export default App
