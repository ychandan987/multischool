// src/models/user.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    canEditStudents: { type: DataTypes.BOOLEAN, defaultValue: false },
    schoolId: { type: DataTypes.INTEGER, allowNull: true }, // null for superadmin
    roleId: { type: DataTypes.INTEGER, allowNull: false }
  });
