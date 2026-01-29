// src/jobs/expirationChecker.js
const NotificationService = require('../services/notificationService');
const db = require('../models');
const Product = db.Product;
const Brand = db.Brand;
const Category = db.Category;

class ExpirationChecker {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    this.checkInterval = 24 * 60 * 60 * 1000; // Check every 24 hours
  }

  // Start the periodic expiration checking
  start() {
    if (this.isRunning) {
      console.log('📅 Expiration checker is already running');
      return;
    }

    console.log('🚀 Starting expiration checker...');
    console.log(`⏰ Check interval: ${this.checkInterval / 1000 / 60 / 60} hours`);

    // Run initial check
    this.runCheck();

    // Set up periodic checking (daily at startup time)
    this.intervalId = setInterval(() => {
      this.runCheck();
    }, this.checkInterval);

    this.isRunning = true;
    console.log('✅ Expiration checker started successfully');
  }

  // Stop the periodic checking
  stop() {
    if (!this.isRunning) {
      console.log('📅 Expiration checker is not running');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    console.log('🛑 Expiration checker stopped');
  }

  // Run the expiration check
  async runCheck() {
    try {
      console.log('📅 Running expiration check...');
      
      const today = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(today.getDate() + 7);

      // Get all products with expiration dates
      const products = await Product.findAll({
        where: {
          expire_date: {
            [db.Sequelize.Op.not]: null
          }
        },
        include: [
          { model: Brand, as: "Brand", attributes: ["name"] },
          { model: Category, as: "Category", attributes: ["name"] }
        ]
      });

      let notificationsCreated = 0;

      for (const product of products) {
        const expireDate = new Date(product.expire_date);
        const productName = product.name || 'Unknown Product';
        const brandName = product.Brand?.name || 'Unknown Brand';
        
        // Calculate days until expiration
        const timeDiff = expireDate - today;
        const daysUntilExpiration = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        // Check if we need to create notifications
        await this.checkAndCreateExpirationNotification(product, daysUntilExpiration, productName, brandName);
        
        if (daysUntilExpiration <= 7 && daysUntilExpiration >= 0) {
          notificationsCreated++;
        }
      }

      console.log(`✅ Expiration check completed. Processed ${products.length} products, ${notificationsCreated} notifications may have been created.`);
      
    } catch (error) {
      console.error('❌ Error during expiration check:', error);
    }
  }

  // Check and create expiration notification for a specific product
  async checkAndCreateExpirationNotification(product, daysUntilExpiration, productName, brandName) {
    try {
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const tomorrowStart = new Date(todayStart);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);

      // Check for existing notifications created today for this product
      const existingNotification = await db.Notification.findOne({
        where: {
          reference_id: product.id,
          type: 'expiring_soon',
          created_at: {
            [db.Sequelize.Op.gte]: todayStart,
            [db.Sequelize.Op.lt]: tomorrowStart
          }
        },
        order: [['created_at', 'DESC']]
      });

      // Create notification for products expiring in exactly 7 days
      if (daysUntilExpiration === 7 && !existingNotification) {
        await NotificationService.createNotification({
          type: 'expiring_soon',
          title: 'ផលិតផលជិតផុតកំណត់ - Product Expiring Soon',
          message: `ផលិតផល "${productName}" នឹងផុតកំណត់ក្នុងរយៈពេល 7 ថ្ងៃទៀត។`,
          referenceId: product.id
        });
        console.log(`📅 7-day expiration notification created for: ${productName}`);
        return true;
      }

      // Create notification for products expiring today
      if (daysUntilExpiration === 0 && !existingNotification) {
        await NotificationService.createNotification({
          type: 'expiring_today',
          title: 'ផលិតផលផុតកំណត់ថ្ងៃនេះ - Product Expires Today',
          message: `ផលិតផល "${productName}" ផុតកំណត់ថ្ងៃនេះ! សូមពិនិត្យមុនពេលប្រើប្រាស់។`,
          referenceId: product.id
        });
        console.log(`⚠️ Expiration today notification created for: ${productName}`);
        return true;
      }

      // Create notification for products that expired (1-3 days overdue)
      if (daysUntilExpiration < 0 && daysUntilExpiration >= -3 && !existingNotification) {
        const daysOverdue = Math.abs(daysUntilExpiration);
        await NotificationService.createNotification({
          type: 'expired',
          title: 'ផលិតផលបានផុតកំណត់ - Product Expired',
          message: `ផលិតផល "${productName}" បានផុតកំណត់ ${daysOverdue} ថ្ងៃហើយ! សូមយកចេញពីស្តុក។`,
          referenceId: product.id
        });
        console.log(`🚨 Expired notification created for: ${productName} (${daysOverdue} days overdue)`);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`❌ Error creating expiration notification for product ${product.id}:`, error);
      return false;
    }
  }

  // Manual trigger for testing
  async checkProductExpiration(productId) {
    try {
      const product = await Product.findByPk(productId, {
        include: [
          { model: Brand, as: "Brand", attributes: ["name"] },
          { model: Category, as: "Category", attributes: ["name"] }
        ]
      });

      if (!product || !product.expire_date) {
        console.log(`Product ${productId} not found or has no expiration date`);
        return false;
      }

      const today = new Date();
      const expireDate = new Date(product.expire_date);
      const timeDiff = expireDate - today;
      const daysUntilExpiration = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      const productName = product.name || 'Unknown Product';
      const brandName = product.Brand?.name || 'Unknown Brand';

      return await this.checkAndCreateExpirationNotification(product, daysUntilExpiration, productName, brandName);
    } catch (error) {
      console.error(`❌ Error checking expiration for product ${productId}:`, error);
      return false;
    }
  }

  // Get status
  getStatus() {
    return {
      isRunning: this.isRunning,
      checkInterval: this.checkInterval,
      nextCheck: this.intervalId ? new Date(Date.now() + this.checkInterval) : null
    };
  }
}

// Create singleton instance
const expirationChecker = new ExpirationChecker();

module.exports = expirationChecker;