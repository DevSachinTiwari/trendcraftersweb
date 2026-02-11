import jwt from 'jsonwebtoken';
import { UserRole } from '../types/auth';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface TokenResponse {
  token: string;
  expiresAt: Date;
}

export class AuthToken {
  private static readonly JWT_SECRET = process.env.JWT_SECRET!;
  private static readonly TOKEN_EXPIRY = '7d'; // 7 days

  static generateToken(payload: JWTPayload): TokenResponse {
    if (!this.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.TOKEN_EXPIRY,
    });

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return { token, expiresAt };
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      if (!this.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
      }

      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  static decodeToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('JWT decode failed:', error);
      return null;
    }
  }
}