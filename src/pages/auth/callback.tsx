import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuthStore} from '../../store/authStore'
import {supabase} from '../../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Получаем сессию из URL (для OAuth)
        const { data: { session }, error } = await supabase.auth.getSessionFromUrl()

        if (error) throw error

        if (session) {
          // Сохраняем сессию
          const { error: sessionError } = await supabase.auth.setSession(session)
          if (sessionError) throw sessionError

          // Проверяем аутентификацию
          await checkAuth()
        }

        // Перенаправляем на главную
        navigate('/')
      } catch (err) {
        console.error('Auth callback error:', err)
        navigate('/login', { state: { error: 'Authentication failed' } })
      }
    }

    handleAuth()
  }, [checkAuth, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
          Processing authentication...
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Please wait while we verify your credentials
        </p>
      </div>
    </div>
  )
}