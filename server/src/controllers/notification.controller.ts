import { Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service.js';
import { AuthRequest } from '../types/index.js';

/**
 * Notification Controller
 * Handles HTTP requests for notification endpoints
 */
export class NotificationController {
  /**
   * GET /api/notifications
   * Gets notifications for current user
   */
  async getNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const unreadOnly = req.query.unreadOnly === 'true';
      const notifications = await notificationService.getUserNotifications(userId, unreadOnly);
      
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/notifications/:id/read
   * Marks a notification as read
   */
  async markAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await notificationService.markAsRead(req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/notifications/read-all
   * Marks all notifications as read
   */
  async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const count = await notificationService.markAllAsRead(userId);
      
      res.status(200).json({
        success: true,
        message: `${count} notifications marked as read`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/notifications/unread-count
   * Gets unread notification count
   */
  async getUnreadCount(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const count = await notificationService.getUnreadCount(userId);
      
      res.status(200).json({
        success: true,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
