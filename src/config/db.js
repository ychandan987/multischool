// src/config/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

function createSequelizeInstance() {
  if (process.env.NODE_ENV === 'test') {
    return new Sequelize('sqlite::memory:', { logging: false });
  }

  return new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  });
}

const sequelize = createSequelizeInstance();

module.exports = sequelize;
