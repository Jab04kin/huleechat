import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Languages, Lock, Moon, Sun, User} from 'lucide-react'
import {Link} from 'react-router-dom'
import logoHulee from '../assets/logohulee.svg'
import '../App.css'

function Login() {
  const { t, i18n } = useTranslation()
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Function to toggle language
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login attempt with:', { email, password })
  }

  return (
    <div className="min-h-screen bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Language and Theme Switchers */}
        <div className="flex justify-end space-x-4 mb-8">
          <button
            className="p-2.5 rounded-full text-text-light dark:text-text-dark transition-all duration-300 flex items-center justify-center gradient-text-hover"
            onClick={toggleLanguage}
            aria-label={t(`language.${i18n.language === 'en' ? 'ru' : 'en'}`)}
          >
            <Languages size={20} />
            <span className="ml-1">{i18n.language.toUpperCase()}</span>
          </button>
          <button
            className="p-2.5 rounded-full text-text-light dark:text-text-dark transition-all duration-300 flex items-center justify-center gradient-text-hover"
            onClick={toggleTheme}
            aria-label={t(`theme.${theme === 'dark' ? 'light' : 'dark'}`)}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Logo and Login Form */}
        <div className="flex flex-col items-center">
          <div>
            <img src={logoHulee} className="logo w-32 h-32 transition-all duration-300" alt="Hulee logo" />
          </div>
          <h1 className="text-4xl font-bold mt-4 mb-8 text-text-light dark:text-text-dark transition-colors duration-300">{t('login.title', 'Login')}</h1>

          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="bg-gray-800 dark:bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 transition-colors duration-300">
              <div className="mb-4">
                <label className="block text-gray-200 dark:text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  {t('login.email', 'Email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    className="shadow appearance-none border rounded-lg w-full py-2 pl-10 pr-3 text-gray-200 dark:text-gray-700 bg-gray-700 dark:bg-white border-gray-600 dark:border-gray-300 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                    id="email"
                    type="email"
                    placeholder={t('login.emailPlaceholder', 'Enter your email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-200 dark:text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  {t('login.password', 'Password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    className="shadow appearance-none border rounded-lg w-full py-2 pl-10 pr-3 text-gray-200 dark:text-gray-700 bg-gray-700 dark:bg-white border-gray-600 dark:border-gray-300 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                    id="password"
                    type="password"
                    placeholder={t('login.passwordPlaceholder', 'Enter your password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 text-gray-200 dark:text-gray-700 gradient-text-hover"
                  type="submit"
                >
                  {t('login.signIn', 'Sign In')}
                </button>
                <a
                  className="inline-block align-baseline font-bold text-sm text-gray-200 dark:text-gray-700 gradient-text-hover"
                  href="#"
                >
                  {t('login.forgotPassword', 'Forgot Password?')}
                </a>
              </div>
            </form>
            <div className="text-center">
              <Link to="/" className="font-medium text-text-light dark:text-text-dark gradient-text-hover">
                {t('login.backToHome', 'Back to Home')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
