/**
 * @fileoverview Modelo de Detalle de Compra (productos incluidos en cada compra)
 * @module models/PurchaseDetail
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo de Detalle de Compra
 * @typedef {Object} PurchaseDetail
 * @property {number} id - ID único del detalle
 * @property {number} purchaseId - ID de la compra
 * @property {number} productId - ID del producto
 * @property {number} cantidad - Cantidad de productos comprados
 * @property {number} precioUnitario - Precio unitario al momento de la compra
 * @property {number} subtotal - Subtotal (cantidad * precioUnitario)
 * @property {Date} createdAt - Fecha de creación del registro
 * @property {Date} updatedAt - Fecha de actualización del registro
 */
const PurchaseDetail = sequelize.define('PurchaseDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  purchaseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'purchases',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'La cantidad debe ser un número entero'
      },
      min: {
        args: [1],
        msg: 'La cantidad debe ser mayor a 0'
      }
    }
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'El precio unitario debe ser un número decimal válido'
      },
      min: {
        args: [0],
        msg: 'El precio unitario no puede ser negativo'
      }
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'El subtotal debe ser un número decimal válido'
      },
      min: {
        args: [0],
        msg: 'El subtotal no puede ser negativo'
      }
    }
  }
}, {
  tableName: 'purchase_details',
  timestamps: true
});

module.exports = PurchaseDetail;
