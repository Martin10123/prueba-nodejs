/**
 * @fileoverview Controlador de autenticación (registro y login)
 * @module controllers/authController
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

/**
 * @api {post} /api/auth/register Registrar nuevo usuario
 * @apiName Register
 * @apiGroup Auth
 * @apiDescription Registra un nuevo usuario en el sistema
 *
 * @apiBody {String} nombre Nombre completo del usuario
 * @apiBody {String} email Email del usuario
 * @apiBody {String} password Contraseña (mínimo 6 caracteres)
 * @apiBody {String="admin","cliente"} [rol=cliente] Rol del usuario
 *
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {String} message Mensaje de confirmación
 * @apiSuccess {Object} data Datos del usuario creado
 * @apiSuccess {Number} data.id ID del usuario
 * @apiSuccess {String} data.nombre Nombre del usuario
 * @apiSuccess {String} data.email Email del usuario
 * @apiSuccess {String} data.rol Rol del usuario
 * @apiSuccess {String} token Token JWT de autenticación
 *
 * @apiError (400) ValidationError Errores de validación en los datos
 * @apiError (409) EmailExists El email ya está registrado
 */
const register = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Crear usuario
    const user = await User.create({
      nombre,
      email,
      password,
      rol: rol || 'cliente'
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    logger.info(`Usuario registrado exitosamente: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      },
      token
    });
  } catch (error) {
    logger.error('Error en registro:', error);
    next(error);
  }
};

/**
 * @api {post} /api/auth/login Iniciar sesión
 * @apiName Login
 * @apiGroup Auth
 * @apiDescription Inicia sesión con email y contraseña
 *
 * @apiBody {String} email Email del usuario
 * @apiBody {String} password Contraseña del usuario
 *
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {String} message Mensaje de confirmación
 * @apiSuccess {Object} data Datos del usuario
 * @apiSuccess {Number} data.id ID del usuario
 * @apiSuccess {String} data.nombre Nombre del usuario
 * @apiSuccess {String} data.email Email del usuario
 * @apiSuccess {String} data.rol Rol del usuario
 * @apiSuccess {String} token Token JWT de autenticación
 *
 * @apiError (400) ValidationError Errores de validación
 * @apiError (401) InvalidCredentials Email o contraseña incorrectos
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn(`Intento de login fallido - Email no existe: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      logger.warn(`Intento de login fallido - Contraseña incorrecta: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    logger.info(`Login exitoso: ${user.email}`);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      },
      token
    });
  } catch (error) {
    logger.error('Error en login:', error);
    next(error);
  }
};

/**
 * @api {get} /api/auth/me Obtener usuario autenticado
 * @apiName GetMe
 * @apiGroup Auth
 * @apiDescription Obtiene la información del usuario autenticado
 *
 * @apiHeader {String} Authorization Bearer token JWT
 *
 * @apiSuccess {Boolean} success Indica si la operación fue exitosa
 * @apiSuccess {Object} data Datos del usuario autenticado
 *
 * @apiError (401) Unauthorized Token no proporcionado o inválido
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Error en getMe:', error);
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
