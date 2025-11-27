const { Product } = require('../models');
const logger = require('../utils/logger');

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
