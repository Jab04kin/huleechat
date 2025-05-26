import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {EditProfile} from './edit';
import {useAuthStore} from '../../store/authStore';
import {ArrowLeft, LogOut} from 'lucide-react';

export function ProfilePage() {
  const navigate = useNavigate();
  const { loading, error, user, logout } = useAuthStore();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !error && showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [loading, error, showSuccess]);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Header карточки */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-accent-light dark:hover:text-accent-dark transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          {/* Body карточки */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">
              Profile Settings
            </h1>

            {error && (
              <div className="mb-4 p-3 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {error}
              </div>
            )}

            {showSuccess && (
              <div className="mb-4 p-3 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                Profile updated successfully!
              </div>
            )}

            <EditProfile />

            {loading && (
              <div className="mt-4 p-3 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Saving changes...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}