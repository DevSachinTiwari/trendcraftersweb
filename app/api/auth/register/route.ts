import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { PasswordUtils } from '../../../../lib/password-utils';
import { AuthToken } from '../../../../lib/auth-token';
import { z } from 'zod';
import { UserRole } from '../../../../types/auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['CUSTOMER', 'SELLER', 'ADMIN']).optional().default('CUSTOMER'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Validate password strength
    const passwordValidation = PasswordUtils.validatePasswordStrength(validatedData.password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Password validation failed', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await PasswordUtils.hashPassword(validatedData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role as UserRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      }
    });

    // Generate JWT token
    const tokenResponse = AuthToken.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name || undefined,
    });

    return NextResponse.json({
      message: 'User registered successfully',
      user,
      token: tokenResponse.token,
      expiresAt: tokenResponse.expiresAt,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}