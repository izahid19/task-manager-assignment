import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { rateLimit } from '../middleware/rateLimiter.middleware.js';
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../dtos/auth.dto.js';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  rateLimit('register'),
  validate(registerSchema),
  authController.register.bind(authController)
);

/**
 * @route POST /api/auth/verify-otp
 * @desc Verify account with OTP
 * @access Public
 */
router.post(
  '/verify-otp',
  rateLimit('verifyOtp'),
  validate(verifyOtpSchema),
  authController.verifyOtp.bind(authController)
);

/**
 * @route POST /api/auth/resend-otp
 * @desc Resend verification OTP
 * @access Public
 */
router.post(
  '/resend-otp',
  rateLimit('resendOtp'),
  validate(resendOtpSchema),
  authController.resendOtp.bind(authController)
);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post(
  '/login',
  rateLimit('login'),
  validate(loginSchema),
  authController.login.bind(authController)
);

/**
 * @route POST /api/auth/forgot-password
 * @desc Request password reset OTP
 * @access Public
 */
router.post(
  '/forgot-password',
  rateLimit('forgotPassword'),
  validate(forgotPasswordSchema),
  authController.forgotPassword.bind(authController)
);

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password with OTP
 * @access Public
 */
router.post(
  '/reset-password',
  rateLimit('resetPassword'),
  validate(resetPasswordSchema),
  authController.resetPassword.bind(authController)
);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Public
 */
router.post('/logout', authController.logout.bind(authController));

export default router;
