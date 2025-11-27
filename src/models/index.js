const User = require('./User');
const Product = require('./Product');
const Purchase = require('./Purchase');
const PurchaseDetail = require('./PurchaseDetail');

User.hasMany(Purchase, {
  foreignKey: 'userId',
  as: 'purchases'
});

Purchase.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Purchase.hasMany(PurchaseDetail, {
  foreignKey: 'purchaseId',
  as: 'details'
});

PurchaseDetail.belongsTo(Purchase, {
  foreignKey: 'purchaseId',
  as: 'purchase'
});

PurchaseDetail.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

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
