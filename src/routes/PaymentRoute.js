const { 
  getPayments, 
  getPaymentById, 
  createPayment, 
  updatePayment, 
  deletePayment 
} = require("../controllers/paymentController");

const PaymentRoutes = (app) => {
  // Get all payments
  app.get("/api/payments", getPayments);
  
  // Get payment by ID
  app.get("/api/payments/:id", getPaymentById);
  
  // Create new payment
  app.post("/api/payments", createPayment);
  
  // Update payment
  app.put("/api/payments/:id", updatePayment);
  
  // Delete payment
  app.delete("/api/payments/:id", deletePayment);
};

module.exports = PaymentRoutes;