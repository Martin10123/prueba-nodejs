/**
 * @fileoverview Modelo de Usuario con roles Admin y Cliente
 * @module models/User
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

/**
 * Modelo de Usuario con propiedades:
 * - id: ID único del usuario
 * - nombre: Nombre completo del usuario
 * - email: Email único del usuario
 * - password: Contraseña encriptada
 * - rol: Rol del usuario (admin o cliente)
 * - createdAt: Fecha de creación
 * - updatedAt: Fecha de actualización
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre es obligatorio'
      },
      len: {
        args: [2, 100],
        msg: 'El nombre debe tener entre 2 y 100 caracteres'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Este email ya está registrado'
    },
    validate: {
      notEmpty: {
        msg: 'El email es obligatorio'
      },
      isEmail: {
        msg: 'Debe proporcionar un email válido'
      }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La contraseña es obligatoria'
      },
      len: {
        args: [6, 255],
        msg: 'La contraseña debe tener al menos 6 caracteres'
      }
    }
  },
  rol: {
    type: DataTypes.ENUM('admin', 'cliente'),
    allowNull: false,
    defaultValue: 'cliente',
    validate: {
      isIn: {
        args: [['admin', 'cliente']],
        msg: 'El rol debe ser admin o cliente'
      }
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    /**
     * Hook para encriptar contraseña antes de crear usuario
     */
    beforeCreate: async (user) => {
      if (user.password) {
        const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
        user.password = await bcrypt.hash(user.password, rounds);
      }
    },
    /**
     * Hook para encriptar contraseña antes de actualizar usuario
     */
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
        user.password = await bcrypt.hash(user.password, rounds);
      }
    }
  }
});

/**
 * Método de instancia para comparar contraseñas
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<boolean>} true si la contraseña coincide
 */
User.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Excluir password de las respuestas JSON
 */
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;
