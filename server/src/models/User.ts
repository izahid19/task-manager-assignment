import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../types/index.js';

/**
 * User document interface extending Mongoose Document
 */
export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User model interface for static methods
 */
export interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password by default in queries
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
    resetOtp: {
      type: String,
      select: false,
    },
    resetOtpExpiry: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const { password, otp, otpExpiry, resetOtp, resetOtpExpiry, __v, ...rest } = ret;
        return rest;
      },
    },
  }
);

/**
 * Hash password before saving
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare password method for authentication
 * @param candidatePassword - The password to compare
 * @returns Boolean indicating if passwords match
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Static method to find user by email
 * @param email - Email to search for
 * @returns User document or null
 */
userSchema.statics.findByEmail = function (
  email: string
): Promise<IUserDocument | null> {
  return this.findOne({ email: email.toLowerCase() });
};

export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
