'use client';

import { useAuthStore } from '../../../lib/auth-store';

export default function CustomerDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Customer Dashboard
            </h1>
            
            <div className="mb-6">
              <p className="text-lg text-gray-600">
                Welcome back, {user?.name || 'Customer'}!
              </p>
              <p className="text-sm text-gray-500">
                Role: {user?.role} | Email: {user?.email}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Orders Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">O</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-blue-900">
                      My Orders
                    </h3>
                    <p className="text-blue-700">
                      Track your orders
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    View Orders
                  </button>
                </div>
              </div>

              {/* Wishlist Card */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">W</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-green-900">
                      Wishlist
                    </h3>
                    <p className="text-green-700">
                      Your saved items
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    View Wishlist
                  </button>
                </div>
              </div>

              {/* Profile Card */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">P</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-purple-900">
                      Profile
                    </h3>
                    <p className="text-purple-700">
                      Manage your account
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Address Book Card */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">A</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-yellow-900">
                      Address Book
                    </h3>
                    <p className="text-yellow-700">
                      Manage addresses
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                    Manage Addresses
                  </button>
                </div>
              </div>

              {/* Payment Methods Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">C</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Payment Methods
                    </h3>
                    <p className="text-gray-700">
                      Manage payment options
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                    Payment Methods
                  </button>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">S</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-red-900">
                      Support
                    </h3>
                    <p className="text-red-700">
                      Get help and support
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Orders
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">
                  You have no recent orders. Start shopping to see your orders here!
                </p>
                <div className="mt-4">
                  <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
                    Start Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}