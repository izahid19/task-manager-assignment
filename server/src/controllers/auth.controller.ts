import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { cookieOptions } from '../utils/jwt.js';

/**
 * Auth Controller
 * Handles HTTP requests for authentication endpoints
 */
export class AuthController {
  /**
   * POST /api/auth/register
   * Registers a new user and sends verification OTP
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for verification OTP.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/verify-otp
   * Verifies user account with OTP
   */
  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.verifyOtp(req.body);
      
      // Set JWT cookie
      res.cookie('token', result.token, cookieOptions);
      
      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        data: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/resend-otp
   * Resends verification OTP
   */
  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.resendOtp(req.body.email);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Logs in a user
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      
      // Set JWT cookie
      res.cookie('token', result.token, cookieOptions);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/forgot-password
   * Initiates password reset by sending OTP
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.forgotPassword(req.body);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/reset-password
   * Resets password using OTP
   */
  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.resetPassword(req.body);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Logs out a user by clearing JWT cookie
   */
  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}

export const authController = new AuthController();
