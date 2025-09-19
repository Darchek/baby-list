"use client";
import { getDictionary } from "@/lib/i18n";
import { useUserStore } from '@/store/userStore';
import NotAuthorized from '@/components/NotAuthorized';
import { useEffect, useState } from 'react';
import { User } from '@/lib/database';
import { getUserList } from '@/lib/fetch';
import { useRouter } from 'next/navigation';
import ResetPassword from "@/components/ResetPassword";

export default function AdminUserPage() {
    const dictionary = getDictionary();
    const { user } = useUserStore();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showResetPassword, setShowResetPassword] = useState(false);

    useEffect(() => {
      if (user && user?.id <= 3) {
        getAllUsers();
      }
    }, [user]);

    const getAllUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserList();
        setUsers(data || []);
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    }

    const createNewUser = () => {
      router.push('/admin/users/new');
    }

    const formatDate = (date: Date | string) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const handleResetPassword = (user: User) => {
      setSelectedUser(user);
      setShowResetPassword(true);
    };

    if (!user || user?.id >= 3) {
      return <NotAuthorized />;
    }

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 pt-[76px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gray-50 pt-[76px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={getAllUsers}
                      className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-gray-50 pt-[76px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage and view all registered users in the system
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white px-4 py-2 rounded-lg shadow">
                <div className="text-sm text-gray-500">Total Users</div>
                <div className="text-2xl font-bold text-gray-900">{users.length}</div>
              </div>
              <button
                onClick={createNewUser}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Create user
              </button>
            </div>
          </div>
        </div>

        {/* Users List */}
        {users.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first user.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.map((userData) => (
              <div key={userData.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {userData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {userData.name}
                        </h3>
                        {userData.id && userData.id <= 3 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{userData.email}</p>
                    </div>
                  </div>
                  
                  {/* User Details */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      ID: {userData.id}
                    </div>
                    {userData.created_at && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m0-10V7m0 10h4m-4 0H6m6-4V7" />
                        </svg>
                        Joined: {formatDate(userData.created_at)}
                      </div>
                    )}
                  </div>
                  
                  {/* User Actions */}
                  <div className="mt-6 flex space-x-2">
                    <button 
                      className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                      onClick={() => { handleResetPassword(userData) }}
                    >
                      Reset password
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showResetPassword && (
        <ResetPassword user={selectedUser} onClose={() => setShowResetPassword(false)} />
      )}
    </div>
  );
}
