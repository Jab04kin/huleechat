import {useTranslation} from 'react-i18next'
import logoHulee from '../assets/logohulee.svg'
import '../App.css'

function Home() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark transition-colors duration-300">
      <div className="container mx-auto px-4 pt-24"> {/* pt-24 для отступа под header */}
        {/* Logo and Content */}
        <div className="flex flex-col items-center">
          <div>
            <img
              src={logoHulee}
              className="logo w-32 h-32 transition-all duration-300"
              alt="Hulee logo"
            />
          </div>
          <h1 className="text-4xl font-bold mt-4 text-text-light dark:text-text-dark transition-colors duration-300 home-heading">
            {t('title')}
          </h1>
          <h3 className="text-xl mt-2 text-text-light dark:text-text-dark transition-colors duration-300 home-heading">
            {t('subtitle')}
          </h3>
        </div>
      </div>
    </div>
  )
}

export default Home