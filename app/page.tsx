'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/auth-context';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Welcome to</span>{' '}
                  <span className="block text-indigo-600 xl:inline">ECommerce Platform</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Your one-stop destination for online shopping. Discover amazing products from trusted sellers around the world.
                </p>

                {isAuthenticated ? (
                  <div className="mt-5 sm:mt-8">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                      <p className="text-lg text-gray-700 mb-4">
                        Welcome back, <span className="font-semibold">{user?.name}</span>!
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        {user?.role === 'ADMIN' && (
                          <Link
                            href="/dashboard/admin"
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 text-center"
                          >
                            Go to Admin Dashboard
                          </Link>
                        )}
                        {user?.role === 'SELLER' && (
                          <Link
                            href="/dashboard/seller"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 text-center"
                          >
                            Go to Seller Dashboard
                          </Link>
                        )}
                        {user?.role === 'CUSTOMER' && (
                          <Link
                            href="/dashboard/customer"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center"
                          >
                            Go to Dashboard
                          </Link>
                        )}
                        <Link
                          href="/products"
                          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 text-center"
                        >
                          Browse Products
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link
                        href="/auth/register"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                      >
                        Get Started
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link
                        href="/auth/login"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                      >
                        Sign In
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Shop with Confidence</h2>
              <p className="text-lg">Secure payments • Fast delivery • Quality products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <span className="font-bold">🛒</span>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Easy Shopping</p>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Browse thousands of products with our intuitive search and filtering system.
                </dd>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <span className="font-bold">🔒</span>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure Payments</p>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Your financial information is protected with industry-standard encryption.
                </dd>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <span className="font-bold">🚚</span>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Fast Delivery</p>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Get your orders delivered quickly with our reliable shipping partners.
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
