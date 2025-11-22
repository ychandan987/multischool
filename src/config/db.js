// src/config/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

function createSequelizeInstance() {
  const {
    NODE_ENV,
    DB_NAME,
    DB_USER,
    DB_PASS,
    DB_HOST,
    DB_PORT
  } = process.env;

  // Test environment → use in-memory SQLite
  if (NODE_ENV === 'test') {
    return new Sequelize('sqlite::memory:', {
      logging: false,
    });
  }

  // Main database (MySQL)
  return new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST || 'localhost',
    dialect: 'mysql',
    port: DB_PORT ? Number(DB_PORT) : 3306,
    logging: false,
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: false,
    },
  });
}

const sequelize = createSequelizeInstance();

module.exports = sequelize;
