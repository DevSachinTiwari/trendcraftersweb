'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../lib/auth-store';

export default function AuthRefresher() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    // Only run if we think we're authenticated
    if (!isAuthenticated) return;

    // Refresh auth every 5 minutes
    const interval = setInterval(() => {
      console.log('AuthRefresher - Refreshing authentication');
      checkAuth();
    }, 5 * 60 * 1000); // 5 minutes

    // Also check on visibility change (when user comes back to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        console.log('AuthRefresher - Tab became visible, checking auth');
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, checkAuth]);

  return null;
}