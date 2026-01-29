// src/jobs/stockLevelChecker.js
const NotificationService = require('../services/notificationService');

class StockLevelChecker {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    this.checkInterval = 30 * 60 * 1000; // 30 minutes in milliseconds
    this.lowStockThreshold = 10;
    this.criticalStockThreshold = 5;
  }

  // Start the periodic stock level checking
  start() {
    if (this.isRunning) {
      // console.log('📊 Stock level checker is already running');
      return;
    }

    // console.log('🚀 Starting stock level checker...');
    // console.log(`⏰ Check interval: ${this.checkInterval / 1000 / 60} minutes`);
    // console.log(`📉 Low stock threshold: ${this.lowStockThreshold}`);
    // console.log(`⚠️ Critical stock threshold: ${this.criticalStockThreshold}`);

    // Run initial check
    this.runCheck();

    // Set up periodic checking
    this.intervalId = setInterval(() => {
      this.runCheck();
    }, this.checkInterval);

    this.isRunning = true;
  }

  // Stop the periodic checking
  stop() {
    if (!this.isRunning) {
      // console.log('📊 Stock level checker is not running');
      return;
    }

    // console.log('🛑 Stopping stock level checker...');
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    console.log('✅ Stock level checker stopped');
  }

  // Run a single stock level check
  async runCheck() {
    try {
      // console.log('🔍 Running scheduled stock level check...');
      const notificationsCreated = await NotificationService.checkStockLevels(
        this.lowStockThreshold,
        this.criticalStockThreshold
      );
      
      if (notificationsCreated > 0) {
        console.log(`✅ Stock check completed: ${notificationsCreated} new notifications created`);
      } else {
        console.log('✅ Stock check completed: No new notifications needed');
      }
    } catch (error) {
      console.error('❌ Error during scheduled stock level check:', error);
    }
  }

  // Run a manual check (can be called via API)
  async runManualCheck() {
    console.log('🔍 Running manual stock level check...');
    try {
      const notificationsCreated = await NotificationService.checkStockLevels(
        this.lowStockThreshold,
        this.criticalStockThreshold
      );
      
      console.log(`✅ Manual stock check completed: ${notificationsCreated} notifications created`);
      return {
        success: true,
        notificationsCreated,
        message: `Stock check completed. ${notificationsCreated} notifications created.`
      };
    } catch (error) {
      console.error('❌ Error during manual stock level check:', error);
      return {
        success: false,
        error: error.message,
        message: 'Error during stock level check'
      };
    }
  }

  // Update thresholds
  updateThresholds(lowStock = 10, criticalStock = 5) {
    this.lowStockThreshold = lowStock;
    this.criticalStockThreshold = criticalStock;
    console.log(`📊 Updated thresholds - Low: ${lowStock}, Critical: ${criticalStock}`);
  }

  // Update check interval
  updateInterval(minutes = 30) {
    const newInterval = minutes * 60 * 1000;
    
    if (this.isRunning) {
      this.stop();
      this.checkInterval = newInterval;
      this.start();
    } else {
      this.checkInterval = newInterval;
    }
    
    console.log(`⏰ Updated check interval to ${minutes} minutes`);
  }

  // Get current status
  getStatus() {
    return {
      isRunning: this.isRunning,
      checkInterval: this.checkInterval,
      checkIntervalMinutes: this.checkInterval / 1000 / 60,
      lowStockThreshold: this.lowStockThreshold,
      criticalStockThreshold: this.criticalStockThreshold,
      nextCheck: this.isRunning ? new Date(Date.now() + this.checkInterval) : null
    };
  }
  
  // Force immediate check (without affecting schedule)
  async forceCheck() {
    console.log('🔍 Forcing immediate stock level check...');
    try {
      const notificationsCreated = await NotificationService.checkStockLevels(
        this.lowStockThreshold,
        this.criticalStockThreshold
      );
      
      console.log(`✅ Forced stock check completed: ${notificationsCreated} notifications created`);
      return {
        success: true,
        notificationsCreated,
        message: `Forced stock check completed. ${notificationsCreated} notifications created.`
      };
    } catch (error) {
      console.error('❌ Error during forced stock level check:', error);
      return {
        success: false,
        error: error.message,
        message: 'Error during forced stock level check'
      };
    }
  }
}

// Create singleton instance
const stockLevelChecker = new StockLevelChecker();

module.exports = stockLevelChecker;