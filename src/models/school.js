// src/models/school.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define('School', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING }
  });
