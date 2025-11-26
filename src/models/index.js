/**
 * @fileoverview Configuración de relaciones entre modelos de Sequelize
 * @module models/index
 */

const User = require('./User');
const Product = require('./Product');
const Purchase = require('./Purchase');
const PurchaseDetail = require('./PurchaseDetail');

/**
 * Definición de relaciones entre modelos
 */

// Un usuario puede tener muchas compras
User.hasMany(Purchase, {
  foreignKey: 'userId',
  as: 'purchases'
});

// Una compra pertenece a un usuario
Purchase.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Una compra tiene muchos detalles
Purchase.hasMany(PurchaseDetail, {
  foreignKey: 'purchaseId',
  as: 'details'
});

// Un detalle pertenece a una compra
PurchaseDetail.belongsTo(Purchase, {
  foreignKey: 'purchaseId',
  as: 'purchase'
});

// Un detalle pertenece a un producto
PurchaseDetail.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

// Un producto puede estar en muchos detalles de compra
Product.hasMany(PurchaseDetail, {
  foreignKey: 'productId',
  as: 'purchaseDetails'
});

module.exports = {
  User,
  Product,
  Purchase,
  PurchaseDetail
};
