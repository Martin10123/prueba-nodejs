const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

const validateRegister = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('rol')
    .optional()
    .isIn(['admin', 'cliente']).withMessage('El rol debe ser admin o cliente'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
  
  handleValidationErrors
];

const validateProduct = [
  body('numeroLote')
    .trim()
    .notEmpty().withMessage('El número de lote es obligatorio'),
  
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del producto es obligatorio')
    .isLength({ min: 2, max: 150 }).withMessage('El nombre debe tener entre 2 y 150 caracteres'),
  
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),
  
  body('cantidadDisponible')
    .notEmpty().withMessage('La cantidad disponible es obligatoria')
    .isInt({ min: 0 }).withMessage('La cantidad debe ser un número entero positivo'),
  
  body('fechaIngreso')
    .notEmpty().withMessage('La fecha de ingreso es obligatoria')
    .isDate().withMessage('Debe proporcionar una fecha válida'),
  
  handleValidationErrors
];

const validatePurchase = [
  body('productos')
    .isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
  
  body('productos.*.productId')
    .notEmpty().withMessage('El ID del producto es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del producto debe ser un número entero positivo'),
  
  body('productos.*.cantidad')
    .notEmpty().withMessage('La cantidad es obligatoria')
    .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validatePurchase
};
