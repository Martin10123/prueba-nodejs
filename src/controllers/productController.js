/**
 * @fileoverview Controlador de productos (CRUD - solo Admin)
 * @module controllers/productController
 */

const { Product } = require('../models');
const logger = require('../utils/logger');

/**
 * @api {get} /api/products Obtener todos los productos
 * @apiName GetProducts
 * @apiGroup Products
 * @apiDescription Obtiene la lista de todos los productos del inventario
 *
 * @apiHeader {String} Authorization Bearer token JWT (admin)
 *
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {Object[]} data Lista de productos
 *
 * @apiError (401) Unauthorized Token no proporcionado o inválido
 * @apiError (403) Forbidden Requiere permisos de administrador
 */
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      order: [['fechaIngreso', 'DESC']]
    });

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    logger.error('Error al obtener productos:', error);
    next(error);
  }
};

/**
 * @api {get} /api/products/:id Obtener producto por ID
 * @apiName GetProduct
 * @apiGroup Products
 * @apiDescription Obtiene un producto específico por su ID
 *
 * @apiHeader {String} Authorization Bearer token JWT (admin)
 * @apiParam {Number} id ID del producto
 *
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {Object} data Datos del producto
 *
 * @apiError (404) NotFound Producto no encontrado
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error('Error al obtener producto:', error);
    next(error);
  }
};

/**
 * @api {post} /api/products Crear nuevo producto
 * @apiName CreateProduct
 * @apiGroup Products
 * @apiDescription Crea un nuevo producto en el inventario
 *
 * @apiHeader {String} Authorization Bearer token JWT (admin)
 *
 * @apiBody {String} numeroLote Número de lote único del producto
 * @apiBody {String} nombre Nombre del producto
 * @apiBody {Number} precio Precio unitario
 * @apiBody {Number} cantidadDisponible Cantidad en inventario
 * @apiBody {Date} fechaIngreso Fecha de ingreso (YYYY-MM-DD)
 *
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {String} message Mensaje de confirmación
 * @apiSuccess {Object} data Datos del producto creado
 *
 * @apiError (400) ValidationError Errores de validación
 * @apiError (409) DuplicateLote El número de lote ya existe
 */
const createProduct = async (req, res, next) => {
  try {
    const { numeroLote, nombre, precio, cantidadDisponible, fechaIngreso } = req.body;

    const product = await Product.create({
      numeroLote,
      nombre,
      precio,
      cantidadDisponible,
      fechaIngreso
    });

    logger.info(`Producto creado: ${product.nombre} (Lote: ${product.numeroLote})`);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product
    });
  } catch (error) {
    logger.error('Error al crear producto:', error);
    next(error);
  }
};

/**
 * @api {put} /api/products/:id Actualizar producto
 * @apiName UpdateProduct
 * @apiGroup Products
 * @apiDescription Actualiza un producto existente
 *
 * @apiHeader {String} Authorization Bearer token JWT (admin)
 * @apiParam {Number} id ID del producto
 *
 * @apiBody {String} [numeroLote] Número de lote
 * @apiBody {String} [nombre] Nombre del producto
 * @apiBody {Number} [precio] Precio unitario
 * @apiBody {Number} [cantidadDisponible] Cantidad en inventario
 * @apiBody {Date} [fechaIngreso] Fecha de ingreso
 *
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {String} message Mensaje de confirmación
 * @apiSuccess {Object} data Datos del producto actualizado
 *
 * @apiError (404) NotFound Producto no encontrado
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { numeroLote, nombre, precio, cantidadDisponible, fechaIngreso } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    await product.update({
      numeroLote: numeroLote || product.numeroLote,
      nombre: nombre || product.nombre,
      precio: precio !== undefined ? precio : product.precio,
      cantidadDisponible: cantidadDisponible !== undefined ? cantidadDisponible : product.cantidadDisponible,
      fechaIngreso: fechaIngreso || product.fechaIngreso
    });

    logger.info(`Producto actualizado: ${product.nombre} (ID: ${product.id})`);

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product
    });
  } catch (error) {
    logger.error('Error al actualizar producto:', error);
    next(error);
  }
};

/**
 * @api {delete} /api/products/:id Eliminar producto
 * @apiName DeleteProduct
 * @apiGroup Products
 * @apiDescription Elimina un producto del inventario
 *
 * @apiHeader {String} Authorization Bearer token JWT (admin)
 * @apiParam {Number} id ID del producto
 *
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {String} message Mensaje de confirmación
 *
 * @apiError (404) NotFound Producto no encontrado
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const productName = product.nombre;
    await product.destroy();

    logger.info(`Producto eliminado: ${productName} (ID: ${id})`);

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    logger.error('Error al eliminar producto:', error);
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
