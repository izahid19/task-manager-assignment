import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { JWTPayload } from '../types/index.js';

/**
 * Generates a JWT token for the given user
 * @param payload - User data to encode in the token
 * @returns Signed JWT token string
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  } as jwt.SignOptions);
};

/**
 * Verifies and decodes a JWT token
 * @param token - The JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
};

/**
 * Cookie options for JWT token storage
 * Uses HttpOnly and Secure flags for security
 */
export const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};
