'use client';

import { useUserStore } from '@/store/userStore';
import { getDictionary } from '@/lib/i18n';
import Link from 'next/link';

export default function Header() {
  const { user } = useUserStore();
  const dict = getDictionary();


  return (
    <header className="bg-white shadow-sm border-b border-gray-200 absolute top-0 left-0 right-0">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <span className="text-3xl">🍼</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{dict.header.title}</h1>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {
              user && user?.id <= 3 && <Link 
                href="/admin" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Admin
              </Link>
            }
          </nav>

          {/* User Info */}
          {user?.isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Not logged in
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
          <nav className="flex space-x-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Gift List
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}