

var { getPurchaseItem, createPurchaseItem, updatePurchaseItem, deletePurchaseItem, getById }=require("../controllers/PurchaseItemController");
const purchaseItem = (app)=>{
    app.get("/api/purchaseItem",getPurchaseItem);
    app.get("/api/purchaseItem/:id",getById);
    app.post("/api/purchaseItem",createPurchaseItem);
    app.put("/api/purchaseItem/:id",updatePurchaseItem);
    app.delete("/api/purchaseItem/:id",deletePurchaseItem);
}

module.exports=purchaseItem;
