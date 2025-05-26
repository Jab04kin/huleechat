import {useTranslation} from 'react-i18next'
import {Languages, LogIn, Moon, Sun} from 'lucide-react'
import {useAuthStore} from '../store/authStore'
import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom';

export function Header() {
  const { t, i18n } = useTranslation()
  const { user, profile, openLoginModal, setAuthModalType } = useAuthStore()
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  )

  // Initialize theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary-light/80 dark:bg-primary-dark/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-accent-light dark:border-accent-dark"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-accent-light dark:bg-accent-dark flex items-center justify-center text-white font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-text-light dark:text-text-dark font-medium">
                {profile?.username || user.email?.split('@')[0]}
              </span>
            </Link>
          ) : (
            <button
              onClick={() => {
                setAuthModalType('login')
                openLoginModal()
              }}
              className="px-4 py-2 rounded-full font-medium text-text-light dark:text-text-dark transition-all duration-300 flex items-center gap-2 gradient-text-hover"
            >
              <LogIn size={18} />
              <span>{t('login.title', 'Login')}</span>
            </button>
          )}

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
      </div>
    </div>
  )
}