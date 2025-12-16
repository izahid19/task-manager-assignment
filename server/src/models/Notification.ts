import mongoose, { Schema, Document } from 'mongoose';
import { INotification } from '../types/index.js';

/**
 * Notification document interface extending Mongoose Document
 */
export interface INotificationDocument extends Omit<INotification, '_id'>, Document {}

const notificationSchema = new Schema<INotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['task_assigned', 'task_updated'],
      required: [true, 'Notification type is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task ID is required'],
    },
    isRead: {
      type: Boolean,
      default: false,
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

// Index for fetching unread notifications efficiently
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotificationDocument>(
  'Notification',
  notificationSchema
);
