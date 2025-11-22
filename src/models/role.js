// src/models/role.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define('Role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  }, { timestamps: false });
