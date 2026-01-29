// routes/notificationRoutes.js
const { 
  getNotifications, 
  getNotificationById,
  markAsRead, 
  markAllAsRead,
  createNotification,
  deleteNotification,
  getUnreadCount,
  // createSampleNotifications
} = require('../controllers/notificationController');
const auth = require('../middlewares/auth.middleware');

const NotificationRoutes = (app) => {
  // Get all notifications (requires authentication)
  app.get('/api/notifications', auth.validate_token(), getNotifications);
  
  // Get unread count (requires authentication) - MUST be before /:id route
  app.get('/api/notifications/unread/count', auth.validate_token(), getUnreadCount);
  
  // Get notification by ID (requires authentication)
  app.get('/api/notifications/:id', auth.validate_token(), getNotificationById);
  
  // Create notification (for testing - requires authentication)
  app.post('/api/notifications', auth.validate_token(), createNotification);
  
  // Create sample notifications (for testing - requires authentication)
  // app.post('/api/notifications/samples/create', auth.validate_token(), createSampleNotifications);
  
  // Mark notification as read (requires authentication)
  app.patch('/api/notifications/:id/read', auth.validate_token(), markAsRead);
  
  // Mark all notifications as read (requires authentication)
  app.patch('/api/notifications/read/all', auth.validate_token(), markAllAsRead);
  
  // Delete notification (requires authentication)
  app.delete('/api/notifications/:id', auth.validate_token(), deleteNotification);
};

module.exports = NotificationRoutes;