import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../middleware/error.middleware.js';
import { UpdateProfileDto } from '../dtos/user.dto.js';

/**
 * User service layer
 * Handles business logic for user profile operations
 */
export class UserService {
  /**
   * Gets user profile by ID
   * @param userId - User ID
   * @returns User profile data
   */
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Updates user profile
   * @param userId - User ID
   * @param data - Profile update data
   * @returns Updated user profile
   */
  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await userRepository.updateById(userId, data);
    if (!updatedUser) {
      throw new AppError('Failed to update profile', 500);
    }

    return {
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      isVerified: updatedUser.isVerified,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  /**
   * Gets all users (for task assignment dropdown)
   * @returns Array of users with basic info
   */
  async getAllUsers() {
    const { User } = await import('../models/User.js');
    const users = await User.find({ isVerified: true }).select('_id email name');
    return users.map((user) => ({
      id: user._id,
      email: user.email,
      name: user.name,
    }));
  }
}

export const userService = new UserService();
