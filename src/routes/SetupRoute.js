// routes/SetupRoute.js
const {
  initializeRolesAndPermissions,
  ensureUserRole,
  getSetupStatus,
  fixUserRolePermissions,
} = require("../controllers/SetupController");

const SetupRoutes = (app) => {
  // Get setup status
  app.get("/api/setup/status", getSetupStatus);
  
  // Initialize roles and permissions (run seeder)
  app.post("/api/setup/init", initializeRolesAndPermissions);
  
  // Quick fix: Create USER role if missing
  app.post("/api/setup/ensure-user-role", ensureUserRole);
  
  // Fix USER role permissions (remove create/edit/delete, keep only view)
  app.post("/api/setup/fix-user-permissions", fixUserRolePermissions);
};

module.exports = SetupRoutes;
