/**
 * @fileoverview Controlador de compras (clientes y administradores)
 * @module controllers/purchaseController
 */

const { sequelize } = require('../config/database');
const { Purchase, PurchaseDetail, Product, User } = require('../models');
const logger = require('../utils/logger');

/**
 * @api {post} /api/purchases Realizar compra
 * @apiName CreatePurchase
 * @apiGroup Purchases
 * @apiDescription Permite a un cliente realizar una compra de productos
 *
 * @apiHeader {String} Authorization Bearer token JWT (cliente)
 *
 * @apiBody {Object[]} productos Lista de productos a comprar
 * @apiBody {Number} productos.productId ID del producto
 * @apiBody {Number} productos.cantidad Cantidad a comprar
 *
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {String} message Mensaje de confirmación
 * @apiSuccess {Object} data Datos de la compra
 *
 * @apiError (400) ValidationError Errores de validación
 * @apiError (400) InsufficientStock Stock insuficiente para uno o más productos
 */
const createPurchase = async (req, res, next) => {
  // Iniciar transacción
  const t = await sequelize.transaction();

  try {
    const { productos } = req.body;
    const userId = req.user.id;

    // Validar que todos los productos existan y tengan stock suficiente
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

    // Crear la compra
    const purchase = await Purchase.create({
      userId,
      fechaCompra: new Date(),
      total
    }, { transaction: t });

    // Crear los detalles de compra y actualizar inventario
    for (const item of productosConPrecios) {
      // Crear detalle de compra
      await PurchaseDetail.create({
        purchaseId: purchase.id,
        productId: item.productId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.subtotal
      }, { transaction: t });

      // Actualizar stock del producto
      await item.product.update({
        cantidadDisponible: item.product.cantidadDisponible - item.cantidad
      }, { transaction: t });
    }

    // Confirmar transacción
    await t.commit();

    logger.info(`Compra realizada - ID: ${purchase.id}, Usuario: ${req.user.email}, Total: $${total}`);

    // Obtener la compra completa con detalles
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

/**
 * @api {get} /api/purchases/my-purchases Historial de compras del cliente
 * @apiName GetMyPurchases
 * @apiGroup Purchases
 * @apiDescription Obtiene el historial de compras del cliente autenticado
 *
 * @apiHeader {String} Authorization Bearer token JWT (cliente)
 *
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {Object[]} data Lista de compras del cliente
 */
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

/**
 * @api {get} /api/purchases/invoice/:id Obtener factura de compra
 * @apiName GetInvoice
 * @apiGroup Purchases
 * @apiDescription Obtiene la factura detallada de una compra específica
 *
 * @apiHeader {String} Authorization Bearer token JWT (cliente)
 * @apiParam {Number} id ID de la compra
 *
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {Object} data Datos completos de la factura
 *
 * @apiError (404) NotFound Compra no encontrada
 * @apiError (403) Forbidden No autorizado para ver esta factura
 */
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

    // Verificar que el cliente solo pueda ver sus propias facturas
    if (req.user.rol === 'cliente' && purchase.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permiso para ver esta factura'
      });
    }

    // Formatear la factura
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

/**
 * @api {get} /api/purchases/all Obtener todas las compras (Admin)
 * @apiName GetAllPurchases
 * @apiGroup Purchases
 * @apiDescription Obtiene todas las compras realizadas por todos los clientes
 *
 * @apiHeader {String} Authorization Bearer token JWT (admin)
 *
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {Object[]} data Lista de todas las compras
 */
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

    // Formatear las compras para mejor legibilidad
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
