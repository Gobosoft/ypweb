import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import './global.css'
import './i18n'
import { AuthProvider } from './context/authContext'
import { AppProvider } from './context/AppProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <AppProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppProvider>
  </Router>
)
