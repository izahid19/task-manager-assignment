import mongoose, { Schema, Document, Model } from 'mongoose';
import { ITask, TaskPriority, TaskStatus } from '../types/index.js';

/**
 * Task document interface extending Mongoose Document
 */
export interface ITaskDocument extends Omit<ITask, '_id'>, Document {}

/**
 * Task model interface for static methods
 */
export interface ITaskModel extends Model<ITaskDocument> {
  findByCreator(creatorId: string): Promise<ITaskDocument[]>;
  findByAssignee(assigneeId: string): Promise<ITaskDocument[]>;
  findOverdue(): Promise<ITaskDocument[]>;
}

const taskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: Object.values(TaskPriority),
        message: 'Priority must be one of: Low, Medium, High, Urgent',
      },
      default: TaskPriority.MEDIUM,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(TaskStatus),
        message: 'Status must be one of: To Do, In Progress, Review, Completed',
      },
      default: TaskStatus.TODO,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
      index: true,
    },
    assignedToId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const { __v, ...rest } = ret;
        return rest;
      },
    },
  }
);

// Compound indexes for efficient querying
taskSchema.index({ creatorId: 1, status: 1 });
taskSchema.index({ assignedToId: 1, status: 1 });
taskSchema.index({ dueDate: 1, status: 1 });

/**
 * Find all tasks created by a specific user
 * @param creatorId - The creator's user ID
 */
taskSchema.statics.findByCreator = function (
  creatorId: string
): Promise<ITaskDocument[]> {
  return this.find({ creatorId }).sort({ createdAt: -1 });
};

/**
 * Find all tasks assigned to a specific user
 * @param assigneeId - The assignee's user ID
 */
taskSchema.statics.findByAssignee = function (
  assigneeId: string
): Promise<ITaskDocument[]> {
  return this.find({ assignedToId: assigneeId }).sort({ dueDate: 1 });
};

/**
 * Find all overdue tasks (due date in the past and not completed)
 */
taskSchema.statics.findOverdue = function (): Promise<ITaskDocument[]> {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $ne: TaskStatus.COMPLETED },
  }).sort({ dueDate: 1 });
};

export const Task = mongoose.model<ITaskDocument, ITaskModel>('Task', taskSchema);
