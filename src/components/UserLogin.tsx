'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { getUserByToken, loginUser } from '@/lib/fetch';
import { getDictionary } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

export default function UserLogin() {
  const dict = getDictionary();
  const { user, login, logout, setUser } = useUserStore();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getCurrentUser();
    }
  }, [user?.id, user?.token]);

  const getCurrentUser = async () => {
    if (!user?.token) {
      logout();
      router.push('/products');
    }
    const token = user?.token || '';
    const { data: dbUser, error } = await getUserByToken(token);
    setUser(dbUser);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !email.trim()) return;

    const { data, error } = await loginUser(email, password);
    if (data && data.id) {
      setIsLoggingIn(true);
      login(data);
    } else {
      setError(dict.login.error);
    }
  };

  if (user?.isLoggedIn) {
    return (
      <div>
      </div>
    );
  }

  // If no user exists, show mandatory login modal that cannot be closed
  return (
    <div className="fixed inset-0 bg-fuchsia-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        {/* No close button - modal cannot be closed */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🍼</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{dict.login.title}</h2>
          <p className="text-gray-600">{dict.login.description}</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder={dict.login.email_placeholder}
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Password *
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder={dict.login.password_placeholder}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoggingIn || !password || !email.trim()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoggingIn ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Joining Baby Shower...
              </>
            ) : (
              dict.login.button
            )}
          </button>
        </form>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>{dict.login.ask}</p>
        </div>
        
        {error && (
          <div className="mt-4 text-red-500 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
