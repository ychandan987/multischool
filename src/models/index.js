// src/models/index.js
const fs = require("fs");
const path = require("path");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// container for all models
const db = {};

// Load all model files dynamically (except index.js)
fs.readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".js"))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Run associations if present
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export sequelize instance + all models
db.sequelize = sequelize;
db.Sequelize = sequelize.constructor;

module.exports = db;
