import { userRepository } from '../repositories/user.repository.js';
import { emailService } from './email.service.js';
import { generateOtp } from '../utils/otp.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../middleware/error.middleware.js';
import {
  storeVerificationOtp,
  getVerificationOtp,
  deleteVerificationOtp,
  storeResetOtp,
  getResetOtp,
  deleteResetOtp,
} from '../config/redis.js';
import {
  RegisterDto,
  LoginDto,
  VerifyOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dtos/auth.dto.js';
import bcrypt from 'bcrypt';

/**
 * Authentication service layer
 * Handles all business logic for user authentication
 * OTPs are stored in Redis with automatic 10-minute expiration
 */
export class AuthService {
  /**
   * Registers a new user and sends verification OTP
   * @param data - Registration data
   * @returns Created user (without sensitive fields)
   */
  async register(data: RegisterDto) {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Generate OTP and store in Redis (10 min expiry)
    const otp = generateOtp();
    await storeVerificationOtp(data.email, otp);

    // Create user (no OTP fields in DB)
    const user = await userRepository.create({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    // Send verification email
    await emailService.sendVerificationOtp(user.email, user.name, otp);

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
    };
  }

  /**
   * Verifies user account with OTP from Redis
   * @param data - OTP verification data
   * @returns JWT token and user data
   */
  async verifyOtp(data: VerifyOtpDto) {
    const user = await userRepository.findByEmail(data.email);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.isVerified) {
      throw new AppError('Account already verified', 400);
    }

    // Get OTP from Redis
    const storedOtp = await getVerificationOtp(data.email);
    
    console.log('🔐 OTP Verification Debug:');
    console.log('   Email:', data.email);
    console.log('   Entered OTP:', data.otp, 'Type:', typeof data.otp);
    console.log('   Stored OTP:', storedOtp, 'Type:', typeof storedOtp);
    
    if (!storedOtp) {
      throw new AppError('OTP has expired or not found. Please request a new one.', 400);
    }

    // Convert both to strings for comparison
    if (String(storedOtp) !== String(data.otp)) {
      throw new AppError('Invalid OTP', 400);
    }

    // Update user to verified and delete OTP from Redis
    await userRepository.updateByEmail(data.email, { isVerified: true });
    await deleteVerificationOtp(data.email);

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: true,
      },
    };
  }

  /**
   * Resends verification OTP (stored in Redis)
   * @param email - User email
   */
  async resendOtp(email: string) {
    const user = await userRepository.findByEmail(email);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.isVerified) {
      throw new AppError('Account already verified', 400);
    }

    // Generate new OTP and store in Redis
    const otp = generateOtp();
    await storeVerificationOtp(email, otp);

    // Send verification email
    await emailService.sendVerificationOtp(user.email, user.name, otp);

    return { message: 'OTP sent successfully' };
  }

  /**
   * Logs in a user
   * @param data - Login credentials
   * @returns JWT token and user data
   */
  async login(data: LoginDto) {
    const user = await userRepository.findByEmailWithPassword(data.email);
    
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isVerified) {
      throw new AppError('Please verify your email before logging in', 403);
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    };
  }

  /**
   * Initiates password reset by sending OTP (stored in Redis)
   * @param data - Forgot password data
   */
  async forgotPassword(data: ForgotPasswordDto) {
    const user = await userRepository.findByEmail(data.email);
    
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If your email is registered, you will receive a password reset OTP' };
    }

    // Generate reset OTP and store in Redis
    const resetOtp = generateOtp();
    await storeResetOtp(data.email, resetOtp);

    // Send password reset email
    await emailService.sendPasswordResetOtp(user.email, user.name, resetOtp);

    return { message: 'If your email is registered, you will receive a password reset OTP' };
  }

  /**
   * Resets password using OTP from Redis
   * @param data - Reset password data
   */
  async resetPassword(data: ResetPasswordDto) {
    const user = await userRepository.findByEmail(data.email);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Get reset OTP from Redis
    const storedOtp = await getResetOtp(data.email);
    
    if (!storedOtp) {
      throw new AppError('OTP has expired or not found. Please request a new one.', 400);
    }

    if (storedOtp !== data.otp) {
      throw new AppError('Invalid OTP', 400);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(data.newPassword, salt);

    // Update password and delete reset OTP from Redis
    await userRepository.updateByEmail(data.email, { password: hashedPassword });
    await deleteResetOtp(data.email);

    return { message: 'Password reset successfully' };
  }
}

export const authService = new AuthService();

