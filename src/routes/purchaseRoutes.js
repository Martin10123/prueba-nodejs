/**
 * @fileoverview Rutas de compras (Cliente y Admin)
 * @module routes/purchaseRoutes
 */

const express = require('express');
const router = express.Router();
const {
  createPurchase,
  getMyPurchases,
  getInvoice,
  getAllPurchases
} = require('../controllers/purchaseController');
const { validatePurchase } = require('../middlewares/validators');
const { authMiddleware, isAdmin } = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @route POST /api/purchases
 * @desc Realizar una compra
 * @access Private (Cliente o Admin)
 */
router.post('/', validatePurchase, createPurchase);

/**
 * @route GET /api/purchases/my-purchases
 * @desc Obtener historial de compras del cliente autenticado
 * @access Private (Cliente o Admin)
 */
router.get('/my-purchases', getMyPurchases);

/**
 * @route GET /api/purchases/invoice/:id
 * @desc Obtener factura de una compra específica
 * @access Private (Cliente o Admin)
 */
router.get('/invoice/:id', getInvoice);

/**
 * @route GET /api/purchases/all
 * @desc Obtener todas las compras realizadas por todos los clientes
 * @access Private (Admin)
 */
router.get('/all', isAdmin, getAllPurchases);

module.exports = router;
