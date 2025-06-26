import { NotificationModel } from "../models/notification.model";
import UserModel from "../models/user.model";

// PUT /api/notifications/:id/read
export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await NotificationModel.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ error: "Notification not found" });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: "Failed to mark notification as read" });
    }
};

// PUT /api/notifications/mark-all-read/:userId
export const markAllNotificationsAsRead = async (req, res) => {
    try {
        await NotificationModel.updateMany({ user: req.params.userId }, { read: true });
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ error: "Failed to mark all as read" });
    }
};

export const getNotificationForUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const notifications = await NotificationModel.find({ user: userId })
            .sort({ createdAt: -1 })
            .exec();


        if (!notifications || notifications.length === 0) {
            return res.status(200).json({ message: "No notifications found" });
        }

        return res.status(200).json(notifications);


    } catch (error) {
        console.log("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Notification ID is required" });
        }
        const notification = await NotificationModel.findByIdAndDelete(id);
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }
        return res.status(200).json({ message: "Notification deleted successfully" });

    } catch (error) {
        return res.status(500).json({ error: "Failed to delete notification" });
    }
}

export const deleteAllNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const notifications = await NotificationModel.deleteMany({ user: userId });
        if (notifications.deletedCount === 0) {
            return res.status(404).json({ message: "No notifications found for this user" });
        }
        return res.status(200).json({ message: "All notifications deleted successfully" });

    } catch (error) {
        return res.status(500).json({ error: "Failed to delete all notifications" });
    }
}

