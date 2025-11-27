const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numeroLote: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      msg: 'Este número de lote ya existe'
    },
    validate: {
      notEmpty: {
        msg: 'El número de lote es obligatorio'
      }
    }
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del producto es obligatorio'
      },
      len: {
        args: [2, 150],
        msg: 'El nombre debe tener entre 2 y 150 caracteres'
      }
    }
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'El precio debe ser un número decimal válido'
      },
      min: {
        args: [0.01],
        msg: 'El precio debe ser mayor a 0'
      }
    }
  },
  cantidadDisponible: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'La cantidad debe ser un número entero'
      },
      min: {
        args: [0],
        msg: 'La cantidad no puede ser negativa'
      }
    }
  },
  fechaIngreso: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: {
        msg: 'Debe proporcionar una fecha válida'
      }
    }
  }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;
