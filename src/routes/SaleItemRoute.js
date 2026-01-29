const { 
  getSaleItemAll, 
  getSaleItemById, 
  getSaleItemsBySaleId,
  createSaleItem, 
  updateSaleItem, 
  deleteSaleItem 
} = require("../controllers/SaleItemController");

const SaleItem = (app) => {
  // Get all sale items
  app.get("/api/saleItems", getSaleItemAll);
  
  // Get sale items by sale ID
  app.get("/api/saleItems/sale/:saleId", getSaleItemsBySaleId);
  
  // Get sale item by ID
  app.get("/api/saleItems/:id", getSaleItemById);
  
  // Create new sale item
  app.post("/api/saleItems", createSaleItem);
  
  // Update sale item
  app.put("/api/saleItems/:id", updateSaleItem);
  
  // Delete sale item
  app.delete("/api/saleItems/:id", deleteSaleItem);
};

module.exports = SaleItem;
