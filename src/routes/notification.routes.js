import { Router } from 'express';
import { requireRole } from '../middlewares/auth.middleware';
import { deleteAllNotifications, deleteNotification, getNotificationForUser, getUnreadNotificationsCount, markAllNotificationsAsRead, markNotificationAsRead } from '../controllers/notification.controller';

export const notificationRouter = Router()

notificationRouter.get('/notifications-count/:userId', requireRole(['user', 'mentor']),getUnreadNotificationsCount)
notificationRouter.get('/get-notification-for-user/:userId', requireRole(['user', 'mentor']), getNotificationForUser);
notificationRouter.put('/mark-all-read/:userId', requireRole(['user', 'mentor']), markAllNotificationsAsRead);
notificationRouter.put('/mark-as-read/:id', requireRole(['user', 'mentor']), markNotificationAsRead);
notificationRouter.delete('/delete/:id', requireRole(['user', 'mentor']), deleteNotification);
notificationRouter.delete('/delete-all-notifications/:userId', requireRole(['user', 'mentor']), deleteAllNotifications);    