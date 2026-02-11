'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/auth-store';

export default function AuthGuard({ 
  children, 
  allowedRoles = [],
  fallbackPath = '/auth/login' 
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallbackPath?: string;
}) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log('AuthGuard - Auth State:', {
      isLoading,
      isAuthenticated,
      user: user ? { id: user.id, email: user.email, role: user.role } : null
    });

    // If not loading and not authenticated, redirect
    if (!isLoading && !isAuthenticated) {
      console.log('AuthGuard - Redirecting to:', fallbackPath);
      router.push(fallbackPath);
      return;
    }

    // If authenticated but role check fails, redirect to unauthorized
    if (!isLoading && isAuthenticated && user && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        console.log('AuthGuard - Role check failed:', { userRole: user.role, allowedRoles });
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router, allowedRoles, fallbackPath]);

  // Show loading while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show loading message while redirecting
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Role check
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Access denied. Insufficient permissions.</p>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized, render children
  return <>{children}</>;
}