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

router.use(authMiddleware);

router.post('/', validatePurchase, createPurchase);

router.get('/my-purchases', getMyPurchases);

router.get('/invoice/:id', getInvoice);

router.get('/all', isAdmin, getAllPurchases);

module.exports = router;
