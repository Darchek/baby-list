import { db } from '@/lib/database';
import UserCard from '@/components/UserCard';
import StatsCard from '@/components/StatsCard';
import UserLogin from '@/components/UserLogin';
import { getDictionary } from '@/lib/i18n';

// This is a Server Component that runs on the server and uses SSR
export default async function Home() {
  const dictionary = getDictionary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      {/* Welcome Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="text-8xl mb-4 animate-bounce">🍼</div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {dictionary.home.title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-blue-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
              {dictionary.welcome.text}
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="flex justify-center items-center space-x-4 mt-8 mb-12">
            <span className="text-3xl animate-pulse">🎁</span>
            <span className="text-2xl text-pink-400">•</span>
            <span className="text-3xl animate-pulse delay-100">👶</span>
            <span className="text-2xl text-blue-400">•</span>
            <span className="text-3xl animate-pulse delay-200">💝</span>
          </div>
        </div>
      </div>
      <div className="text-center pb-12">
        <a
          href="/products"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold text-lg rounded-full hover:from-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <span className="mr-3 text-2xl">🎁</span>
          {dictionary.welcome.button}
          <span className="ml-3 text-xl">→</span>
        </a>
      </div>

      <UserLogin />
    </div>
  );
}
