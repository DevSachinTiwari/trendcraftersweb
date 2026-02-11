'use client';

import { useAuth } from '../../../contexts/auth-context';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Admin Dashboard
            </h1>
            
            <div className="mb-6">
              <p className="text-lg text-gray-600">
                Welcome back, {user?.name || 'Admin'}!
              </p>
              <p className="text-sm text-gray-500">
                Role: {user?.role} | Email: {user?.email}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* User Management Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">U</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">
                      User Management
                    </h3>
                    <p className="text-blue-700">
                      Manage customers and sellers
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Manage Users
                  </button>
                </div>
              </div>

              {/* Product Management Card */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">P</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-green-900">
                      Product Management
                    </h3>
                    <p className="text-green-700">
                      Oversee all products
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Manage Products
                  </button>
                </div>
              </div>

              {/* Analytics Card */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">A</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-purple-900">
                      Analytics
                    </h3>
                    <p className="text-purple-700">
                      View platform metrics
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                    View Analytics
                  </button>
                </div>
              </div>

              {/* Order Management Card */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">O</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-yellow-900">
                      Order Management
                    </h3>
                    <p className="text-yellow-700">
                      Manage all orders
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                    Manage Orders
                  </button>
                </div>
              </div>

              {/* Settings Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">S</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Settings
                    </h3>
                    <p className="text-gray-700">
                      Platform configuration
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                    Settings
                  </button>
                </div>
              </div>

              {/* Reports Card */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">R</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-red-900">
                      Reports
                    </h3>
                    <p className="text-red-700">
                      Generate reports
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    View Reports
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">
                  No recent activity to display. This is where you would see platform updates and notifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}