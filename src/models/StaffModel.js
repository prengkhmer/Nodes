const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
const Staff = sequelize.define(
  "Staff",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    staff_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: "staffs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,

  }
);

Staff.associate = function(models) {
    try {
      if (models.Role) {
        Staff.belongsTo(models.Role, { foreignKey: "role_id", as: "Role" });
      }
    } catch (error) {
      // console.error('Error in Staff.associate:', error);
    }
    return Staff;
  }
  };

// modules.exports = Staff;