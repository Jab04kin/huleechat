import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuthStore} from '../../store/authStore'
import {supabase} from '../../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { checkAuth } = useAuthStore()

useEffect(() => {
  let isMounted = true;

  const handleAuth = async () => {
    // 1. Получение сессии
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      if (isMounted) navigate('/login', {
        state: { error: sessionError.message || 'Session error' }
      });
      return;
    }

    if (sessionData.session) {
      // 2. Обработка существующей сессии
      const { error: authError } = await checkAuth();
      if (authError) {
        console.error('Auth check failed:', authError);
        if (isMounted) navigate('/login', { state: { error: 'Auth check failed' } });
        return;
      }
      if (isMounted) navigate('/');
      return;
    }

    // 3. Обработка OAuth callback
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!accessToken || !refreshToken) {
      if (isMounted) navigate('/login', { state: { error: 'Missing tokens' } });
      return;
    }

    // 4. Установка сессии
    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    if (setSessionError) {
      console.error('Set session error:', setSessionError);
      if (isMounted) navigate('/login', {
        state: { error: setSessionError.message || 'Session setup failed' }
      });
      return;
    }

    // 5. Финальная проверка аутентификации
    const { error: finalAuthError } = await checkAuth();
    if (finalAuthError) {
      console.error('Final auth check failed:', finalAuthError);
      if (isMounted) navigate('/login', { state: { error: 'Auth verification failed' } });
      return;
    }

    if (isMounted) navigate('/');
  };

  handleAuth();

  return () => { isMounted = false; };
}, [checkAuth, navigate]);

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