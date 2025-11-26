/**
 * @fileoverview Rutas de autenticación
 * @module routes/authRoutes
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validators');
const { authMiddleware } = require('../middlewares/auth');

/**
 * @route POST /api/auth/register
 * @desc Registrar nuevo usuario
 * @access Public
 */
router.post('/register', validateRegister, register);

/**
 * @route POST /api/auth/login
 * @desc Iniciar sesión
 * @access Public
 */
router.post('/login', validateLogin, login);

/**
 * @route GET /api/auth/me
 * @desc Obtener usuario autenticado
 * @access Private
 */
router.get('/me', authMiddleware, getMe);

module.exports = router;
