var {
  getAllPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
  getByIDPurchase,
} = require("../controllers/PurchaseController");
const purchase = (app) => {
  app.get("/api/purchase", getAllPurchase);
  app.get("/api/purchase/:id", getByIDPurchase);
  app.post("/api/purchase", createPurchase);
  app.put("/api/purchase/:id", updatePurchase);
  app.delete("/api/purchase/:id", deletePurchase);
};
module.exports = purchase;
