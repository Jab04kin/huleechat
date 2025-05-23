import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Languages, LogIn, Moon, Sun} from 'lucide-react'
import {useAuthStore} from '../store/authStore'
import logoHulee from '../assets/logohulee.svg'
import '../App.css'

function Home() {
  const { t, i18n } = useTranslation()
  const { openLoginModal } = useAuthStore()
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  )

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

  return (
    <div className="min-h-screen bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Language and Theme Switchers */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => openLoginModal()}
            className="px-4 py-2 rounded-full font-medium text-text-light dark:text-text-dark transition-all duration-300 flex items-center gap-2 gradient-text-hover"
          >
            <LogIn size={18} />
            <span>{t('login.title', 'Login')}</span>
          </button>

          <div className="flex space-x-4">
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
        </div>

        {/* Logo and Content */}
        <div className="flex flex-col items-center">
          <div>
            <img src={logoHulee} className="logo w-32 h-32 transition-all duration-300" alt="Hulee logo" />
          </div>
          <h1 className="text-4xl font-bold mt-4 text-text-light dark:text-text-dark transition-colors duration-300 home-heading">{t('title')}</h1>
          <h3 className="text-xl mt-2 text-text-light dark:text-text-dark transition-colors duration-300 home-heading">{t('subtitle')}</h3>
        </div>
      </div>
    </div>
  )
}

export default Home
