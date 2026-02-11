import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AuthToken } from '../../../../lib/auth-token';
import { prisma } from '../../../../lib/prisma';

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  profileImage: z.string().url().nullable().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    // Get and verify auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = AuthToken.verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Update user profile
    console.log('=== PROFILE UPDATE DEBUG ===');
    console.log('User ID:', payload.userId);
    console.log('Update data:', validatedData);
    console.log('Database URL (first 20 chars):', process.env.DATABASE_URL?.substring(0, 20));
    
    let updatedUser;
    try {
      // First, let's try to find the user to make sure they exist
      const existingUser = await prisma.user.findUnique({
        where: { id: payload.userId }
      });
      
      console.log('User found:', !!existingUser);
      
      if (!existingUser) {
        console.log('User not found in database');
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      updatedUser = await prisma.user.update({
        where: {
          id: payload.userId,
        },
        data: validatedData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profileImage: true,
          createdAt: true,
        },
      });
      
      console.log('User update successful:', updatedUser.email);
    } catch (dbError) {
      console.error('=== DATABASE ERROR DETAILS ===');
      console.error('Error type:', typeof dbError);
      console.error('Error constructor:', dbError?.constructor?.name);
      console.error('Error message:', dbError instanceof Error ? dbError.message : 'Unknown');
      
      // Type-safe way to check for Prisma error properties
      const prismaError = dbError as { code?: string; meta?: unknown };
      console.error('Error code:', prismaError?.code);
      console.error('Error meta:', prismaError?.meta);
      console.error('Full error object:', dbError);
      
      // Check if it's a Prisma error
      if (prismaError?.code) {
        return NextResponse.json(
          { 
            error: 'Database error',
            details: `Prisma error ${prismaError.code}: ${dbError instanceof Error ? dbError.message : 'Unknown'}`,
            errorCode: prismaError.code
          },
          { status: 500 }
        );
      }

      // Check if it's an RLS error
      if (dbError instanceof Error) {
        const errorMsg = dbError.message.toLowerCase();
        if (errorMsg.includes('row-level security') || 
            errorMsg.includes('policy') ||
            errorMsg.includes('rls')) {
          return NextResponse.json(
            { 
              statusCode: "403",
              error: "Unauthorized", 
              message: "new row violates row-level security policy",
              details: `RLS Policy Error: ${dbError.message}`,
              solution: 'Run emergency-rls-fix.sql to disable RLS policies.'
            },
            { status: 403 }
          );
        }

        // Check for other permission errors
        if (errorMsg.includes('permission denied') || 
            errorMsg.includes('insufficient privilege')) {
          return NextResponse.json(
            { 
              statusCode: "403",
              error: "Unauthorized",
              message: "permission denied",
              details: `Permission Error: ${dbError.message}`
            },
            { status: 403 }
          );
        }
      }
      
      return NextResponse.json(
        { 
          error: 'Database operation failed.',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get and verify auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = AuthToken.verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile fetch error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}