import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

/**
 * @route GET /api/notifications
 * @desc Get notifications for current user
 * @access Private
 */
router.get('/', notificationController.getNotifications.bind(notificationController) as any);

/**
 * @route GET /api/notifications/unread-count
 * @desc Get unread notification count
 * @access Private
 */
router.get(
  '/unread-count',
  notificationController.getUnreadCount.bind(notificationController) as any
);

/**
 * @route PATCH /api/notifications/read-all
 * @desc Mark all notifications as read
 * @access Private
 */
router.patch(
  '/read-all',
  notificationController.markAllAsRead.bind(notificationController) as any
);

/**
 * @route PATCH /api/notifications/:id/read
 * @desc Mark a notification as read
 * @access Private
 */
router.patch(
  '/:id/read',
  notificationController.markAsRead.bind(notificationController) as any
);

export default router;
