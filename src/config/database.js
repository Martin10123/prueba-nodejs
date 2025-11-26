/**
 * @fileoverview Configuración de conexión a la base de datos con Sequelize
 * @module config/database
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();
const logger = require('../utils/logger');

/**
 * Instancia de Sequelize para la conexión a PostgreSQL
 * @type {Sequelize}
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

/**
 * Prueba la conexión a la base de datos
 * @async
 * @function testConnection
 * @returns {Promise<boolean>} true si la conexión es exitosa
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✓ Conexión a la base de datos establecida correctamente.');
    return true;
  } catch (error) {
    logger.error('✗ No se pudo conectar a la base de datos:', error);
    return false;
  }
};

module.exports = { sequelize, testConnection };
