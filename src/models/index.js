'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    try {
      const modelExport = require(path.join(__dirname, file));
      let model;
      
      if (typeof modelExport === 'function') {
        model = modelExport(sequelize, Sequelize.DataTypes);
      } else {
        model = modelExport;
      }
      
      if (model && model.name) {
        db[model.name] = model;
      }
    } catch (error) {
      // console.error(`Error loading model ${file}:`, error.message);
    }
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
    } catch (error) {
      // console.error(`Error associating model ${modelName}:`, error.message);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// let sequelize;

// if (process.env.MYSQLHOST) {
//   // ✅ Railway / Production
//   sequelize = new Sequelize(
//     process.env.MYSQLDATABASE,
//     process.env.MYSQLUSER,
//     process.env.MYSQLPASSWORD,
//     {
//       host: process.env.MYSQLHOST,
//       port: Number(process.env.MYSQLPORT || 3306),
//       dialect: "mysql",
//       logging: false,
//     }
//   );
// } else {
//   // ✅ Local dev (config.json)
//   const config = require(__dirname + "/../../config/config.json")[env];
//   if (config.use_env_variable) {
//     sequelize = new Sequelize(process.env[config.use_env_variable], config);
//   } else {
//     sequelize = new Sequelize(
//       config.database,
//       config.username,
//       config.password,
//       config
//     );
//   }
// }
