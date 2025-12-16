import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

/**
 * Enum for task priority levels
 */
export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

/**
 * Enum for task status
 */
export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  COMPLETED = 'Completed',
}

/**
 * User interface representing a user document
 */
export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  resetOtp?: string;
  resetOtpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Task interface representing a task document
 */
export interface ITask {
  _id: Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: Types.ObjectId;
  assignedToId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Notification interface for in-app notifications
 */
export interface INotification {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: 'task_assigned' | 'task_updated';
  message: string;
  taskId: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

/**
 * JWT payload structure
 */
export interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * Extended Express Request with authenticated user
 */
export interface AuthRequest extends Request {
  user?: JWTPayload;
}

/**
 * Express async handler type
 */
export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * API Error response structure
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * API Success response structure
 */
export interface ApiSuccess<T = unknown> {
  success: true;
  message?: string;
  data?: T;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Task filter parameters
 */
export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  creatorId?: string;
  assignedToId?: string;
  overdue?: boolean;
}
