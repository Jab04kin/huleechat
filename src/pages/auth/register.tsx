import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuthStore} from '../../store/authStore'
import {useTranslation} from 'react-i18next'
import {ArrowLeft, Lock, Mail, User} from 'lucide-react'
import {FaDiscord, FaGithub, FaGoogle} from 'react-icons/fa'

export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const { register, loginWithSocial, loading, error, resetError } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    resetError()
    await register(email, password, username)
  }

  const handleSocialLogin = (provider: 'google' | 'github' | 'discord') => {
    resetError()
    loginWithSocial(provider)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-300 mb-6"
        >
          <ArrowLeft className="mr-2" size={18} />
          {t('auth.back', 'Back')}
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {t('auth.register', 'Create Account')}
            </h2>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-gray-400 dark:text-gray-500" size={18} />
                </div>
                <input
                  type="text"
                  placeholder={t('auth.username', 'Username')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400 dark:text-gray-500" size={18} />
                </div>
                <input
                  type="email"
                  placeholder={t('auth.email', 'Email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400 dark:text-gray-500" size={18} />
                </div>
                <input
                  type="password"
                  placeholder={t('auth.password', 'Password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-text-btn sign-in-btn py-2"
              >
                {t('auth.register', 'Sign Up')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                {t('auth.already_have_account', 'Already have an account?')}{' '}
              </span>
              <Link
                to="/login"
                className="gradient-text-btn text-sm font-medium"
              >
                {t('auth.login', 'Login')}
              </Link>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                    {t('auth.or_continue_with', 'Or continue with')}
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
    </div>
  )
}