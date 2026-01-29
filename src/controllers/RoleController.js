// const db = require("../models");
// // const roleModel = require("../models/role.model");
// const Role = db.Role;
// // Create a new role
// const createRole = async (req, res) => {
//   const { name, description } = req.body;

//   try {
//     const existingRole = await Role.findOne({ where: { name } });
//     if (existingRole) {
//       return res.status(400).json({ message: "Role already exists" });
//     }

//     const newRole = await Role.create({ name, description });
//     res
//       .status(201)
//       .json({ message: "Role created successfully", roleId: newRole.id });
//   } catch (error) {
//     console.error("Error creating role:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Get all roles
// const getAllRoles = async (req, res) => {
//   try {
//     const roles = await Role.findAll();
//     res.json(roles);
//   } catch (error) {
//     console.error("Error fetching roles:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Get a role by ID
// const getRoleById = async (req, res) => {
//   const roleId = req.params.id;

//   try {
//     const role = await Role.findByPk(roleId);
//     if (!role) {
//       return res.status(404).json({ message: "Role not found" });
//     }

//     res.json(role);
//   } catch (error) {
//     console.error("Error fetching role:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const updateRole = async (req, res) => {
//   const { id } = req.params;
//   const { name, description } = req.body;

//   try {
//     const role = await Role.findByPk(id);
//     if (!role) {
//       return res.status(404).json({ message: "Role not found" });
//     }

//     // Only check uniqueness if the name is being changed
//     if (name && name !== role.name) {
//       const existingRole = await Role.findOne({ where: { name } });
//       if (existingRole) {
//         return res.status(400).json({
//           message: "A role with this name already exists",
//         });
//       }
//     }

//     await role.update({ name, description });

//     res.status(200).json({
//       message: "Role updated successfully",
//       role,
//     });
//   } catch (error) {
//     console.error("Error updating role:", error);

//     // Handle other unexpected errors
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Delete a role
// const deleteRole = async (req, res) => {
//   const roleId = req.params.id;

//   try {
//     const role = await Role.findByPk(roleId);
//     if (!role) {
//       return res.status(404).json({ message: "Role not found" });
//     }

//     await role.destroy();
//     res.json({ message: "Role deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting role:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = {
//   createRole,
//   getAllRoles,
//   getRoleById,
//   updateRole,
//   deleteRole,
// };


const db = require("../models");
const { Op } = require("sequelize");

const Role = db.Role;
const User = db.User;

const normalizeRoleName = (name) => String(name || "").trim().toUpperCase();

const createRole = async (req, res) => {
  if (!Role) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error - Role model not loaded",
    });
  }

  let { name, description } = req.body;
  name = normalizeRoleName(name);

  if (!name) {
    return res.status(400).json({ success: false, message: "Role name is required" });
  }

  try {
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(400).json({ success: false, message: "Role already exists" });
    }

    const newRole = await Role.create({
      name,
      description: description || null,
    });

    return res.status(201).json({
      success: true,
      message: "Role created successfully",
      role: newRole,
    });
  } catch (error) {
    console.error("Error creating role:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

const getAllRoles = async (req, res) => {
  if (!Role) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error - Role model not loaded",
    });
  }

  try {
    const { limit = 50, offset = 0, q = "" } = req.query;

    const where = q
      ? {
          name: { [Op.like]: `%${String(q).trim().toUpperCase()}%` },
        }
      : {};

    const roles = await Role.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "ASC"]],
    });

    return res.json({ success: true, roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getRoleById = async (req, res) => {
  if (!Role) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error - Role model not loaded",
    });
  }

  const roleId = req.params.id;

  try {
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    return res.json({ success: true, role });
  } catch (error) {
    console.error("Error fetching role:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateRole = async (req, res) => {
  if (!Role) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error - Role model not loaded",
    });
  }

  const { id } = req.params;
  let { name, description } = req.body;

  try {
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    // normalize name if provided
    if (name !== undefined) name = normalizeRoleName(name);

    // uniqueness check
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: "A role with this name already exists",
        });
      }
    }

    await role.update({
      name: name || role.name,
      description: description !== undefined ? description : role.description,
    });

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      role,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteRole = async (req, res) => {
  if (!Role) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error - Role model not loaded",
    });
  }

  const roleId = req.params.id;

  try {
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    // ✅ prevent deleting role in use
    if (User) {
      const userCount = await User.count({ where: { role_id: roleId } });
      if (userCount > 0) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete role because it is assigned to users",
        });
      }
    }

    await role.destroy();
    return res.json({ success: true, message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
