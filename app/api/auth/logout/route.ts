import { NextResponse } from 'next/server';

export async function POST() {
  // For JWT-based auth, logout is handled client-side by removing the token
  // This endpoint can be used for logging purposes or blacklisting tokens in the future
  
  return NextResponse.json({
    message: 'Logged out successfully'
  });
}