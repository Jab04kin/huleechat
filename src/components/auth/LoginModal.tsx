import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuthStore} from '../../store/authStore'
import {useTranslation} from 'react-i18next'
import {Lock, User, X} from 'lucide-react'
import {FaDiscord, FaGithub, FaGoogle} from 'react-icons/fa'
import clsx from 'clsx'

type LoginModalProps = {
  onClose: () => void
  className?: string
}

export function LoginModal({ onClose, className }: LoginModalProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const { login, loginWithSocial, loading, error, resetError } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    resetError()
    await login(email, password)
  }

  const handleSocialLogin = (provider: 'google' | 'github' | 'discord') => {
    resetError()
    loginWithSocial(provider)
  }

  const handleRegisterRedirect = () => {
    onClose()
    navigate('/register')
  }

  return (
    <div className={clsx(
      'fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-center justify-center z-50',
      className
    )}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t('login.title', 'Login')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {error && (
            <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  type="email"
                  placeholder={t('login.emailPlaceholder', 'Email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  type="password"
                  placeholder={t('login.passwordPlaceholder', 'Password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {t('login.rememberMe', 'Remember me')}
                </label>
              </div>

              <button
                type="button"
                onClick={handleRegisterRedirect}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('login.createAccount', 'Create account')}
              </button>
            </div>

            <button
              className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-70"
              type="submit"
              disabled={loading}
            >
              {t('login.signIn', 'Sign In')}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                  {t('login.or_continue_with', 'Or continue with')}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="social-auth-btn"
              >
                <div className="gradient-icon-wrapper">
                  <FaGoogle className="social-icon" />
                </div>
              </button>
              <button
                onClick={() => handleSocialLogin('github')}
                disabled={loading}
                className="social-auth-btn"
              >
                <div className="gradient-icon-wrapper">
                  <FaGithub className="social-icon" />
                </div>
              </button>
              <button
                onClick={() => handleSocialLogin('discord')}
                disabled={loading}
                className="social-auth-btn"
              >
                <div className="gradient-icon-wrapper">
                  <FaDiscord className="social-icon" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}