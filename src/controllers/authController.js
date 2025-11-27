const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

const register = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const user = await User.create({
      nombre,
      email,
      password,
      rol: rol || 'cliente'
    });

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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn(`Intento de login fallido - Email no existe: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos'
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      logger.warn(`Intento de login fallido - Contraseña incorrecta: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos'
      });
    }

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
