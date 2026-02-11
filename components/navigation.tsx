'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">
                ECommerce
              </span>
            </Link>

            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/"
                className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Products
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex md:items-center md:space-x-4">
                  <span className="text-gray-700">
                    Welcome, <span className="font-medium">{user?.name}</span>
                  </span>
                  
                  {/* Role-based navigation */}
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/dashboard/admin"
                      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Admin
                    </Link>
                  )}
                  
                  {user?.role === 'SELLER' && (
                    <Link
                      href="/dashboard/seller"
                      className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Seller Dashboard
                    </Link>
                  )}
                  
                  {user?.role === 'CUSTOMER' && (
                    <Link
                      href="/dashboard/customer"
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Profile
                  </Link>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isAuthenticated && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <span className="text-gray-700 px-3 py-2 text-sm">
                Welcome, <span className="font-medium">{user?.name}</span> ({user?.role})
              </span>
              
              {user?.role === 'ADMIN' && (
                <Link
                  href="/dashboard/admin"
                  className="text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin Dashboard
                </Link>
              )}
              
              {user?.role === 'SELLER' && (
                <Link
                  href="/dashboard/seller"
                  className="text-green-700 hover:bg-green-50 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Seller Dashboard
                </Link>
              )}
              
              {user?.role === 'CUSTOMER' && (
                <Link
                  href="/dashboard/customer"
                  className="text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}

              <Link
                href="/profile"
                className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}