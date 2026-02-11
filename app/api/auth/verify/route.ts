import { NextRequest, NextResponse } from 'next/server';
import { AuthToken } from '../../../../lib/auth-token';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No valid token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = AuthToken.verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Optionally verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        emailVerified: true,
        profileImage: true, // Include profile image
        createdAt: true,     // Include created date
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,	
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        emailVerified: user.emailVerified,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
      valid: true,
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}