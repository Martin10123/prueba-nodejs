const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const purchaseRoutes = require('./purchaseRoutes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/purchases', purchaseRoutes);

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Inventario - Prueba Técnica',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      purchases: '/api/purchases'
    }
  });
});

module.exports = router;
