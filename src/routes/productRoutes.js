
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

router.use(authMiddleware);
router.use(isAdmin);

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.post('/', validateProduct, createProduct);

router.put('/:id', validateProduct, updateProduct);

router.delete('/:id', deleteProduct);

module.exports = router;
