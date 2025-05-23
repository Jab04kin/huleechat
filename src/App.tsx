import {Route, Routes} from 'react-router-dom'
import {useAuthStore} from './store/authStore'
import {LoginModal} from './components/auth/LoginModal'
import {useEffect} from 'react'
import HomePage from './pages/Home'
import {RegisterPage} from './pages/auth/register'
import AuthCallback from './pages/auth/callback'

function App() {
  const { checkAuth, isLoginModalOpen, closeLoginModal } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Основной контент */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>

      {/* Глобальная модалка авторизации */}
      {isLoginModalOpen && <LoginModal />}
    </div>
  )
}

export default App