const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/RoleController");

const Role = (app) => {
  // Create a new role
  app.post("/api/roles", createRole);

  // Get all roles
  app.get("/api/roles", getAllRoles);

  // Get a role by ID
  app.get("/api/roles/:id", getRoleById);

  // Update a role
  app.put("/api/roles/:id", updateRole);

  // Delete a role
  app.delete("/api/roles/:id", deleteRole);
};

module.exports = Role;
