import { User, IUserDocument } from '../models/User.js';

/**
 * User repository layer
 * Handles all database operations for User model
 */
export class UserRepository {
  /**
   * Creates a new user
   * @param data - User data including email, password, name
   * @returns Created user document
   */
  async create(data: {
    email: string;
    password: string;
    name: string;
    otp?: string;
    otpExpiry?: Date;
  }): Promise<IUserDocument> {
    const user = new User(data);
    return user.save();
  }

  /**
   * Finds a user by ID
   * @param id - User ID
   * @returns User document or null
   */
  async findById(id: string): Promise<IUserDocument | null> {
    return User.findById(id);
  }

  /**
   * Finds a user by email
   * @param email - User email
   * @returns User document or null
   */
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findByEmail(email);
  }

  /**
   * Finds a user by email with password included
   * @param email - User email
   * @returns User document with password or null
   */
  async findByEmailWithPassword(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email: email.toLowerCase() }).select('+password');
  }

  /**
   * Finds a user by email with OTP fields included
   * @param email - User email
   * @returns User document with OTP fields or null
   */
  async findByEmailWithOtp(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpiry');
  }

  /**
   * Finds a user by email with reset OTP fields included
   * @param email - User email
   * @returns User document with reset OTP fields or null
   */
  async findByEmailWithResetOtp(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email: email.toLowerCase() }).select('+resetOtp +resetOtpExpiry');
  }

  /**
   * Updates a user by ID
   * @param id - User ID
   * @param data - Partial user data to update
   * @returns Updated user document or null
   */
  async updateById(
    id: string,
    data: Partial<{
      name: string;
      password: string;
      isVerified: boolean;
      otp: string | null;
      otpExpiry: Date | null;
      resetOtp: string | null;
      resetOtpExpiry: Date | null;
    }>
  ): Promise<IUserDocument | null> {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  /**
   * Updates a user by email
   * @param email - User email
   * @param data - Partial user data to update
   * @returns Updated user document or null
   */
  async updateByEmail(
    email: string,
    data: Partial<{
      name: string;
      password: string;
      isVerified: boolean;
      otp: string | null;
      otpExpiry: Date | null;
      resetOtp: string | null;
      resetOtpExpiry: Date | null;
    }>
  ): Promise<IUserDocument | null> {
    return User.findOneAndUpdate(
      { email: email.toLowerCase() },
      data,
      { new: true, runValidators: true }
    );
  }

  /**
   * Checks if email already exists
   * @param email - Email to check
   * @returns Boolean indicating if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await User.countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }
}

export const userRepository = new UserRepository();
