// controllers/notificationController.js
const NotificationService = require("../services/notificationService");
const expirationChecker = require("../jobs/expirationChecker");

// Get all notifications
const getNotifications = async (req, res) => {
  try {
    const { limit = 12, unreadOnly = false } = req.query;
    const notifications = await NotificationService.getRecentNotifications(
      parseInt(limit),
      unreadOnly === "true"
    );
    const unreadCount = await NotificationService.getUnreadCount();

    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: {
        notifications,
        unreadCount,
        total: notifications.length,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await NotificationService.getNotificationById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification retrieved successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notification",
      error: error.message,
    });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await NotificationService.getUnreadCount();

    res.status(200).json({
      success: true,
      message: "Unread count retrieved successfully",
      data: {
        unreadCount,
      },
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching unread count",
      error: error.message,
    });
  }
};

// Create notification (for testing)
const createNotification = async (req, res) => {
  try {
    const { type, title, message, reference_id } = req.body;

    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "type, title, and message are required",
      });
    }

    const notification = await NotificationService.createNotification({
      type,
      title,
      message,
      referenceId: reference_id,
    });

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({
      success: false,
      message: "Error creating notification",
      error: error.message,
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await NotificationService.markAsRead(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    const unreadCount = await NotificationService.getUnreadCount();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: {
        notification,
        unreadCount,
      },
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Error marking notification as read",
      error: error.message,
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const result = await NotificationService.markAllAsRead();

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: {
        updatedCount: result,
      },
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Error marking all notifications as read",
      error: error.message,
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await NotificationService.deleteNotification(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: { id: parseInt(id) },
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    });
  }
};



// Manually trigger expiration check (for testing)
const checkExpirations = async (req, res) => {
  try {
    console.log('🔄 Manual expiration check triggered...');
    await expirationChecker.runCheck();
    
    res.status(200).json({
      success: true,
      message: 'Expiration check completed successfully',
      data: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error during manual expiration check:', error);
    res.status(500).json({
      success: false,
      message: 'Error during expiration check',
      error: error.message
    });
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  // createSampleNotifications,
  checkExpirations,
};