var {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const auth = require('../middlewares/auth.middleware');
const customers = (app) => {
  app.get("/api/customers", auth.validate_token(), getAllCustomers);
  app.get("/api/customers/:id", getCustomerById);
  app.post("/api/customers", createCustomer);
  app.put("/api/customers/:id", updateCustomer);
  app.delete("/api/customers/:id",deleteCustomer);
};
module.exports = customers;
