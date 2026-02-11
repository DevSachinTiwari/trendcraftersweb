import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { UserRole } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          isLoading: false 
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (response.ok && data.user) {
            const user = {
              ...data.user,
              createdAt: new Date(data.user.createdAt)
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            return { success: true, user };
          } else {
            set({ isLoading: false });
            return { success: false, error: data.error || 'Login failed' };
          }
        } catch (error: unknown) {
          set({ isLoading: false });
          const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
          return { success: false, error: errorMessage };
        }
      },

      register: async (email: string, password: string, name: string, role: UserRole = 'CUSTOMER') => {
        set({ isLoading: true });
        
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, role }),
          });

          const data = await response.json();

          if (response.ok && data.user) {
            const user = {
              ...data.user,
              createdAt: new Date(data.user.createdAt)
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            return { success: true, user };
          } else {
            set({ isLoading: false });
            return { success: false, error: data.error || 'Registration failed' };
          }
        } catch (error: unknown) {
          set({ isLoading: false });
          const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
          
          // Clear auth state
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
          
          // Clear cookie
          Cookies.remove('auth-token');
        } catch (error) {
          console.error('Logout error:', error);
          // Clear state anyway
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },

      checkAuth: async () => {
        const token = Cookies.get('auth-token');
        
        if (!token) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
          return;
        }

        set({ isLoading: true });
        
        try {
          const response = await fetch('/api/auth/verify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const user = {
              ...data.user,
              createdAt: new Date(data.user.createdAt)
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            // Invalid token
            Cookies.remove('auth-token');
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('Auth check error:', error);
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);