
// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("ecommerce", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
//   port: 3306,
//   logging: false, 
// });

// module.exports = sequelize;

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    port: Number(process.env.MYSQLPORT || 3306),
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;

// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   process.env.MYSQLDATABASE,
//   process.env.MYSQLUSER,
//   process.env.MYSQLPASSWORD,
//   {
//     host: process.env.MYSQLHOST,
//     port: Number(process.env.MYSQLPORT),
//     dialect: "mysql",
//     logging: false,
//   }
// );

// module.exports = sequelize;
