import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { AuthRequest } from '../types/index.js';

/**
 * Authentication middleware
 * Verifies JWT token from cookies and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
      return;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.',
      });
      return;
    }

    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication middleware
 * Attaches user to request if valid token exists, but doesn't require it
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        (req as AuthRequest).user = decoded;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
