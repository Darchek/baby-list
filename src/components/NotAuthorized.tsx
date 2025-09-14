'use client';

import { useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';

export default function NotAuthorized() {
  const router = useRouter();
  const dict = getDictionary();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="text-8xl mb-6 animate-bounce">🔒</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-blue-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-700 mb-2">
            You need to be logged in to access the gift list
          </p>
          <p className="text-gray-600">
            Please return to the home page to sign in
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold text-lg rounded-full hover:from-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="mr-3 text-2xl">🏠</span>
            Go to Home Page
            <span className="ml-3 text-xl">→</span>
          </button>
        </div>

        <div className="mt-8 flex justify-center items-center space-x-4">
          <span className="text-2xl animate-pulse">🍼</span>
          <span className="text-lg text-pink-400">•</span>
          <span className="text-2xl animate-pulse delay-100">👶</span>
          <span className="text-lg text-blue-400">•</span>
          <span className="text-2xl animate-pulse delay-200">🎁</span>
        </div>
      </div>
    </div>
  );
}