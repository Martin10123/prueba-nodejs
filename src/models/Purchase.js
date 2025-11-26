/**
 * @fileoverview Modelo de Compra realizada por un cliente
 * @module models/Purchase
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo de Compra
 * @typedef {Object} Purchase
 * @property {number} id - ID único de la compra
 * @property {number} userId - ID del usuario que realiza la compra
 * @property {Date} fechaCompra - Fecha y hora de la compra
 * @property {number} total - Monto total de la compra
 * @property {Date} createdAt - Fecha de creación del registro
 * @property {Date} updatedAt - Fecha de actualización del registro
 */
const Purchase = sequelize.define('Purchase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  fechaCompra: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'El total debe ser un número decimal válido'
      },
      min: {
        args: [0],
        msg: 'El total no puede ser negativo'
      }
    }
  }
}, {
  tableName: 'purchases',
  timestamps: true
});

module.exports = Purchase;
