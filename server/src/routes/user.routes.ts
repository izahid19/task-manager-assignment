import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../dtos/user.dto.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

/**
 * @route GET /api/users
 * @desc Get all verified users (for task assignment)
 * @access Private
 */
router.get('/', userController.getAllUsers.bind(userController) as any);

/**
 * @route GET /api/users/profile
 * @desc Get current user's profile
 * @access Private
 */
router.get('/profile', userController.getProfile.bind(userController) as any);

/**
 * @route PATCH /api/users/profile
 * @desc Update current user's profile
 * @access Private
 */
router.patch(
  '/profile',
  validate(updateProfileSchema),
  userController.updateProfile.bind(userController) as any
);

export default router;
