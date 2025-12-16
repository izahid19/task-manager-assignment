import { Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import { AuthRequest } from '../types/index.js';

/**
 * User Controller
 * Handles HTTP requests for user profile endpoints
 */
export class UserController {
  /**
   * GET /api/users/profile
   * Gets current user's profile
   */
  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await userService.getProfile(userId);
      
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/users/profile
   * Updates current user's profile
   */
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await userService.updateProfile(userId, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users
   * Gets all verified users (for task assignment)
   */
  async getAllUsers(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
