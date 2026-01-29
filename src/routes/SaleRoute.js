const { 
  getSales, 
  getSaleById, 
  createSale, 
  updateSale, 
  deleteSale 
} = require("../controllers/SaleController");

const Sales = (app) => {
  // Get all sales
  app.get("/api/sales", getSales);
  
  // Get sale by ID
  app.get("/api/sales/:id", getSaleById);
  
  // Create new sale
  app.post("/api/sales", createSale);
  
  // Update sale
  app.put("/api/sales/:id", updateSale);
  
  // Delete sale
  app.delete("/api/sales/:id", deleteSale);
};

module.exports = Sales;;