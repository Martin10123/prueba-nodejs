const { sequelize } = require('../config/database');
const { Purchase, PurchaseDetail, Product, User } = require('../models');
const logger = require('../utils/logger');

const createPurchase = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { productos } = req.body;
    const userId = req.user.id;

    const productosConPrecios = [];
    let total = 0;

    for (const item of productos) {
      const product = await Product.findByPk(item.productId, { transaction: t });

      if (!product) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: `Producto con ID ${item.productId} no encontrado`
        });
      }

      if (product.cantidadDisponible < item.cantidad) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para el producto "${product.nombre}". Disponible: ${product.cantidadDisponible}, Solicitado: ${item.cantidad}`
        });
      }

      const subtotal = parseFloat(product.precio) * item.cantidad;
      total += subtotal;

      productosConPrecios.push({
        productId: product.id,
        cantidad: item.cantidad,
        precioUnitario: product.precio,
        subtotal,
        product
      });
    }

    const purchase = await Purchase.create({
      userId,
      fechaCompra: new Date(),
      total
    }, { transaction: t });

    for (const item of productosConPrecios) {
      await PurchaseDetail.create({
        purchaseId: purchase.id,
        productId: item.productId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.subtotal
      }, { transaction: t });

      await item.product.update({
        cantidadDisponible: item.product.cantidadDisponible - item.cantidad
      }, { transaction: t });
    }

    await t.commit();

    logger.info(`Compra realizada - ID: ${purchase.id}, Usuario: ${req.user.email}, Total: $${total}`);

    const purchaseComplete = await Purchase.findByPk(purchase.id, {
      include: [
        {
          model: PurchaseDetail,
          as: 'details',
          include: [{
            model: Product,
            as: 'product'
          }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Compra realizada exitosamente',
      data: purchaseComplete
    });
  } catch (error) {
    await t.rollback();
    logger.error('Error al realizar compra:', error);
    next(error);
  }
};

const getMyPurchases = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const purchases = await Purchase.findAll({
      where: { userId },
      include: [
        {
          model: PurchaseDetail,
          as: 'details',
          include: [{
            model: Product,
            as: 'product'
          }]
        }
      ],
      order: [['fechaCompra', 'DESC']]
    });

    res.json({
      success: true,
      data: purchases,
      count: purchases.length
    });
  } catch (error) {
    logger.error('Error al obtener historial de compras:', error);
    next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const purchase = await Purchase.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: PurchaseDetail,
          as: 'details',
          include: [{
            model: Product,
            as: 'product'
          }]
        }
      ]
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Compra no encontrada'
      });
    }

    if (req.user.rol === 'cliente' && purchase.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para ver esta factura'
      });
    }

    const invoice = {
      id: purchase.id,
      fechaCompra: purchase.fechaCompra,
      cliente: {
        nombre: purchase.user.nombre,
        email: purchase.user.email
      },
      productos: purchase.details.map(detail => ({
        nombre: detail.product.nombre,
        numeroLote: detail.product.numeroLote,
        cantidad: detail.cantidad,
        precioUnitario: parseFloat(detail.precioUnitario),
        subtotal: parseFloat(detail.subtotal)
      })),
      total: parseFloat(purchase.total)
    };

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    logger.error('Error al obtener factura:', error);
    next(error);
  }
};

const getAllPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: PurchaseDetail,
          as: 'details',
          include: [{
            model: Product,
            as: 'product'
          }]
        }
      ],
      order: [['fechaCompra', 'DESC']]
    });

    const formattedPurchases = purchases.map(purchase => ({
      id: purchase.id,
      fechaCompra: purchase.fechaCompra,
      cliente: {
        id: purchase.user.id,
        nombre: purchase.user.nombre,
        email: purchase.user.email
      },
      productosComprados: purchase.details.map(detail => ({
        producto: detail.product.nombre,
        numeroLote: detail.product.numeroLote,
        cantidad: detail.cantidad,
        precioUnitario: parseFloat(detail.precioUnitario),
        subtotal: parseFloat(detail.subtotal)
      })),
      total: parseFloat(purchase.total)
    }));

    res.json({
      success: true,
      data: formattedPurchases,
      count: formattedPurchases.length
    });
  } catch (error) {
    logger.error('Error al obtener todas las compras:', error);
    next(error);
  }
};

module.exports = {
  createPurchase,
  getMyPurchases,
  getInvoice,
  getAllPurchases
};
