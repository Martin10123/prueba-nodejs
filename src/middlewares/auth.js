/**
 * @fileoverview Middleware de autenticación JWT
 * @module middlewares/auth
 */

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { User } = require('../models');

/**
 * Middleware para verificar JWT token
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Siguiente middleware
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado. Acceso denegado.'
      });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado. Token inválido.'
      });
    }

    // Agregar usuario a la request
    req.user = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol
    };

    next();
  } catch (error) {
    logger.error('Error en autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Por favor inicie sesión nuevamente.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error en la autenticación.'
    });
  }
};

/**
 * Middleware para verificar rol de administrador
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Siguiente middleware
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    logger.warn(`Intento de acceso no autorizado por usuario: ${req.user?.email}`);
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }
};

/**
 * Middleware para verificar rol de cliente
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Siguiente middleware
 */
const isCliente = (req, res, next) => {
  if (req.user && req.user.rol === 'cliente') {
    next();
  } else {
    logger.warn(`Intento de acceso de cliente no autorizado: ${req.user?.email}`);
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Requiere rol de cliente.'
    });
  }
};

module.exports = {
  authMiddleware,
  isAdmin,
  isCliente
};
