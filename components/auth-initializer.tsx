'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../lib/auth-store';

export default function AuthInitializer() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    console.log('AuthInitializer - Starting auth check');
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log('AuthInitializer - Loading state:', isLoading);
  }, [isLoading]);

  return null; // This component doesn't render anything
}