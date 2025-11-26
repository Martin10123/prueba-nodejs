/**
 * @fileoverview Rutas de productos (Admin)
 * @module routes/productRoutes
 */

const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { validateProduct } = require('../middlewares/validators');
const { authMiddleware, isAdmin } = require('../middlewares/auth');

// Todas las rutas requieren autenticación de admin
router.use(authMiddleware);
router.use(isAdmin);

/**
 * @route GET /api/products
 * @desc Obtener todos los productos
 * @access Private (Admin)
 */
router.get('/', getAllProducts);

/**
 * @route GET /api/products/:id
 * @desc Obtener producto por ID
 * @access Private (Admin)
 */
router.get('/:id', getProductById);

/**
 * @route POST /api/products
 * @desc Crear nuevo producto
 * @access Private (Admin)
 */
router.post('/', validateProduct, createProduct);

/**
 * @route PUT /api/products/:id
 * @desc Actualizar producto
 * @access Private (Admin)
 */
router.put('/:id', validateProduct, updateProduct);

/**
 * @route DELETE /api/products/:id
 * @desc Eliminar producto
 * @access Private (Admin)
 */
router.delete('/:id', deleteProduct);

module.exports = router;
