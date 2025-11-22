// src/models/index.js
const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Role = require('./role')(sequelize, DataTypes);
const School = require('./school')(sequelize, DataTypes);
const User = require('./user')(sequelize, DataTypes);
const Student = require('./student')(sequelize, DataTypes);

// associations
School.hasMany(User, { foreignKey: 'schoolId', onDelete: 'CASCADE' });
User.belongsTo(School, { foreignKey: 'schoolId' });

School.hasMany(Student, { foreignKey: 'schoolId', onDelete: 'CASCADE' });
Student.belongsTo(School, { foreignKey: 'schoolId' });

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

module.exports = {
  sequelize,
  Role,
  School,
  User,
  Student,
};
