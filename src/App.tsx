import {Route, Routes} from 'react-router-dom'
import {AuthModal} from './components/auth/AuthModal'
import {useAuthStore} from './store/authStore'
import {useEffect} from 'react'
import HomePage from './pages/Home'
import {RegisterPage} from './pages/auth/register'
import AuthCallback from './pages/auth/callback'
import {Header} from './components/Header'
import {ProfilePage} from './pages/profile/ProfilePage';

function App() {
  const {
    checkAuth,
    isLoginModalOpen,
    closeLoginModal,
    error: authError
  } = useAuthStore()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth()
      } catch (error) {
        console.error('Initial auth check failed:', error)
      }
    }
    initializeAuth()
  }, [checkAuth])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="pt-20"> {/* Отступ для фиксированного header */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </div>

      {isLoginModalOpen && (
        <AuthModal
          onClose={closeLoginModal}
          error={authError}
        />
      )}
    </div>
  )
}

export default App