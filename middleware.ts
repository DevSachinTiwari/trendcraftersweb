import { NextRequest, NextResponse } from 'next/server';
import { AuthToken } from './lib/auth-token';
import { UserRole } from '@prisma/client';

// Define protected routes and their required roles
const protectedRoutes: Record<string, UserRole[]> = {
  '/dashboard/admin': ['ADMIN'],
  '/dashboard/seller': ['SELLER', 'ADMIN'], 
  '/dashboard/customer': ['CUSTOMER', 'SELLER', 'ADMIN'],
  '/profile': ['CUSTOMER', 'SELLER', 'ADMIN'],
};

// Routes that require authentication but no specific role
const authRequiredRoutes = [
  '/dashboard',
  '/profile',
  '/orders',
];

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/products',
  '/api/auth/login',
  '/api/auth/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;

  // For dashboard routes, always require authentication
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      console.log('No token found for dashboard access, redirecting to login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Verify token
    const payload = AuthToken.verifyToken(token);
    if (!payload) {
      console.log('Invalid token for dashboard access, redirecting to login');
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }

    // Check role-based access for specific dashboard routes
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(payload.role)) {
          console.log(`Role ${payload.role} not allowed for ${route}`);
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }
    }

    return NextResponse.next();
  }

  if (!token) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Verify token
  const payload = AuthToken.verifyToken(token);
  if (!payload) {
    // Invalid token, redirect to login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }

  // Check role-based access
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(payload.role)) {
        // User doesn't have required role, redirect to unauthorized
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  // Check if route requires authentication
  if (authRequiredRoutes.some(route => pathname.startsWith(route))) {
    // User is authenticated, allow access
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};