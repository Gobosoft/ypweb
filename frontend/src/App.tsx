import { useTranslation } from 'react-i18next'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { useAuth } from './context/authContext'
import SmallLoadingCircleOnly from './components/Loading/SmallLoadingCircle'
import { Navigate, Route, Routes } from 'react-router'
import MainScreenView from './views/MainScreen/MainScreenView'
import Navbar from './components/Navbar/Navbar'
import LoginForm from './components/Login/LoginForm'
import UserProvider from './context/UserProvider'
import RegisterView from './views/Register/RegisterView'
import SingleCompanyView from './views/SingleCompany/SingleCompanyView'
import AdminSettings from './views/Settings/AdminSettings'

function App() {
  const { t } = useTranslation()
  const { isLoggedIn, languageIsSet, handleLogin, handleLogout } = useAuth()

  if (!languageIsSet) {
    return <SmallLoadingCircleOnly />
  }

  return (
    <div>
      <Navbar onLogoutSuccess={handleLogout} />
      <Routes>
        <Route element={<UserProvider />}>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to={t('paths.mainscreen')} />
              ) : (
                <LoginForm onLoginSuccess={handleLogin} />
              )
            }
          />
          <Route path={t('paths.mainscreen')} element={<MainScreenView />} />
          <Route path={t('paths.register')} element={<RegisterView />} />
          <Route
            path={`${t('paths.singleCompany')}/:id`}
            element={<SingleCompanyView />}
          />
          <Route path={t('paths.settings')} element={<AdminSettings />} />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
