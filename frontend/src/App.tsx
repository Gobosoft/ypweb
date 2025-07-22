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
import CompanyListView from './views/CompanyListView/CompanyListView'
import AdminSettings from './views/Settings/AdminSettings'
import UsersList from './views/Settings/UsersList'
import AdminSettingsLayout from './layouts/AdminSettingsLayout'

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
          <Route path={t('paths.companyList')} element={<CompanyListView />} />
          <Route
            path={`${t('paths.singleCompany')}/:id`}
            element={<SingleCompanyView />}
          />
          <Route path={t('paths.settings')} element={<AdminSettingsLayout />}>
            <Route path="" element={<AdminSettings />} />
            <Route path={t('paths.usersList')}>
              <Route path="" element={<UsersList />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
