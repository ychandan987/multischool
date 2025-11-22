// src/models/student.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define('Student', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING },
    dob: { type: DataTypes.DATEONLY },
    rollNumber: { type: DataTypes.STRING },
    schoolId: { type: DataTypes.INTEGER, allowNull: false }
  });
