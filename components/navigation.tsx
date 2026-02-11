'use client';

import Link from 'next/link';
import { useAuthStore } from '../lib/auth-store';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { 
  Store, 
  User, 
  LogOut, 
  ShoppingBag, 
  Settings, 
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN':
        return '/dashboard/admin';
      case 'SELLER':
        return '/dashboard/seller';
      case 'CUSTOMER':
        return '/dashboard/customer';
      default:
        return '/';
    }
  };

  const getRoleIcon = () => {
    if (!user) return null;
    switch (user.role) {
      case 'ADMIN':
        return <Shield className="h-4 w-4" />;
      case 'SELLER':
        return <Store className="h-4 w-4" />;
      case 'CUSTOMER':
        return <ShoppingBag className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = () => {
    if (!user) return '';
    switch (user.role) {
      case 'ADMIN':
        return 'Admin';
      case 'SELLER':
        return 'Seller';
      case 'CUSTOMER':
        return 'Customer';
      default:
        return '';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="shrink-0 flex items-center">
              <Store className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="text-2xl font-bold text-indigo-600">
                ECommerce
              </span>
            </Link>

            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/"
                className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Products
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex md:items-center md:space-x-4">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-md">
                    {getRoleIcon()}
                    <span className="text-sm text-gray-700">
                      {user?.name} <span className="text-xs text-gray-500">({getRoleLabel()})</span>
                    </span>
                  </div>
                  
                  <Link
                    href={getDashboardPath()}
                    className="flex items-center space-x-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>

                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    {isMobileMenuOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Button asChild>
                  <Link href="/auth/register">
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-md mt-2">
              <div className="flex items-center space-x-2 px-3 py-2">
                {getRoleIcon()}
                <span className="text-sm font-medium text-gray-900">
                  {user?.name} ({getRoleLabel()})
                </span>
              </div>
              
              <Link
                href={getDashboardPath()}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}