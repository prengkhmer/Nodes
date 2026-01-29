var {
  getAllSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
} = require("../controllers/SupplierController");
const supplier = (app) => {
  app.get("/api/supplier", getAllSupplier);
  app.get("/api/supplier/:id",getSupplierById);
  app.post("/api/supplier", createSupplier);
  app.put("/api/supplier/:id", updateSupplier);
  app.delete("/api/supplier/:id", deleteSupplier);
};
module.exports = supplier;
