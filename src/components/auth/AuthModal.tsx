import {useState} from 'react';
import {useAuthStore} from '../../store/authStore';
import {useTranslation} from 'react-i18next';
import {Lock, Mail, User, X} from 'lucide-react';
import {FaDiscord, FaGithub, FaGoogle} from 'react-icons/fa';
import clsx from 'clsx';

type AuthModalProps = {
  onClose: () => void;
  className?: string;
  error?: string | null;
};

export function AuthModal({
                            onClose,
                            className,
                            error
                          }: AuthModalProps) {
  const { t } = useTranslation();
  const {
    login,
    register,
    loginWithSocial,
    loading,
    resetError,
    authModalType,
    setAuthModalType
  } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();

    if (authModalType === 'login') {
      await login(email, password);
    } else {
      await register(email, password, username);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github' | 'discord') => {
    resetError();
    loginWithSocial(provider);
  };

  const switchType = () => {
    resetError();
    setAuthModalType(authModalType === 'login' ? 'register' : 'login');
  };

  return (
    <div className={clsx(
      'fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-center justify-center z-50',
      className
    )}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t(authModalType === 'login' ? 'login.title' : 'register.title')}
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
            {authModalType === 'register' && (
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    type="text"
                    placeholder={t('register.usernamePlaceholder', 'Username')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400 dark:text-gray-500" />
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

            {authModalType === 'login' && (
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
                  onClick={switchType}
                  className="gradient-text-btn text-sm font-medium"
                >
                  {t('login.createAccount', 'Create account')}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-text-btn sign-in-btn py-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t(authModalType === 'login' ? 'login.signing_in' : 'register.creating_account')}
                </>
              ) : (
                t(authModalType === 'login' ? 'login.sign_in' : 'register.create_account')
              )}
            </button>

            {authModalType === 'register' && (
              <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                {t('register.already_have_account')}{' '}
                <button
                  type="button"
                  onClick={switchType}
                  className="gradient-text-btn font-medium"
                >
                  {t('register.sign_in')}
                </button>
              </div>
            )}
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
  );
}