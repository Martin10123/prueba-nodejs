/**
 * @fileoverview Script para crear datos de prueba inicial
 * @description Ejecutar con: node src/utils/seedData.js
 */

require('dotenv').config();
const { sequelize, testConnection } = require('../config/database');
const { User, Product } = require('../models');
const logger = require('./logger');

/**
 * Datos de usuarios de prueba
 */
const usuarios = [
  {
    nombre: 'Administrador Principal',
    email: 'admin@inventario.com',
    password: '123456',
    rol: 'admin'
  },
  {
    nombre: 'María García',
    email: 'maria@cliente.com',
    password: '123456',
    rol: 'cliente'
  },
  {
    nombre: 'Carlos López',
    email: 'carlos@cliente.com',
    password: '123456',
    rol: 'cliente'
  }
];

/**
 * Datos de productos de prueba
 */
const productos = [
  {
    numeroLote: 'LOT-2025-001',
    nombre: 'Laptop Dell Inspiron 15',
    precio: 1200.00,
    cantidadDisponible: 15,
    fechaIngreso: '2025-11-01'
  },
  {
    numeroLote: 'LOT-2025-002',
    nombre: 'Mouse Logitech MX Master 3',
    precio: 99.99,
    cantidadDisponible: 50,
    fechaIngreso: '2025-11-05'
  },
  {
    numeroLote: 'LOT-2025-003',
    nombre: 'Teclado Mecánico Corsair K70',
    precio: 159.99,
    cantidadDisponible: 30,
    fechaIngreso: '2025-11-08'
  },
  {
    numeroLote: 'LOT-2025-004',
    nombre: 'Monitor Samsung 27" 4K',
    precio: 450.00,
    cantidadDisponible: 20,
    fechaIngreso: '2025-11-10'
  },
  {
    numeroLote: 'LOT-2025-005',
    nombre: 'Auriculares Sony WH-1000XM5',
    precio: 350.00,
    cantidadDisponible: 25,
    fechaIngreso: '2025-11-12'
  },
  {
    numeroLote: 'LOT-2025-006',
    nombre: 'Webcam Logitech Brio 4K',
    precio: 199.99,
    cantidadDisponible: 40,
    fechaIngreso: '2025-11-15'
  },
  {
    numeroLote: 'LOT-2025-007',
    nombre: 'SSD Samsung 970 EVO 1TB',
    precio: 120.00,
    cantidadDisponible: 60,
    fechaIngreso: '2025-11-18'
  },
  {
    numeroLote: 'LOT-2025-008',
    nombre: 'Hub USB-C 7 puertos',
    precio: 45.00,
    cantidadDisponible: 35,
    fechaIngreso: '2025-11-20'
  },
  {
    numeroLote: 'LOT-2025-009',
    nombre: 'Silla Ergonómica Herman Miller',
    precio: 800.00,
    cantidadDisponible: 10,
    fechaIngreso: '2025-11-22'
  },
  {
    numeroLote: 'LOT-2025-010',
    nombre: 'Desk Lamp LED Xiaomi',
    precio: 35.00,
    cantidadDisponible: 45,
    fechaIngreso: '2025-11-25'
  }
];

/**
 * Función principal para insertar datos
 */
const seedData = async () => {
  try {
    // Conectar a la base de datos
    const connected = await testConnection();
    
    if (!connected) {
      logger.error('No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // Sincronizar modelos (crea las tablas si no existen)
    await sequelize.sync({ force: true }); // CUIDADO: force:true elimina todas las tablas
    logger.info('✓ Base de datos sincronizada');

    // Crear usuarios
    logger.info('Creando usuarios de prueba...');
    for (const userData of usuarios) {
      await User.create(userData);
      logger.info(`  ✓ Usuario creado: ${userData.email} (${userData.rol})`);
    }

    // Crear productos
    logger.info('\nCreando productos de prueba...');
    for (const productData of productos) {
      await Product.create(productData);
      logger.info(`  ✓ Producto creado: ${productData.nombre}`);
    }

    logger.info('\n╔════════════════════════════════════════════════╗');
    logger.info('║  ✅ Datos de prueba creados exitosamente      ║');
    logger.info('╚════════════════════════════════════════════════╝');
    logger.info('\n📝 Credenciales de prueba:');
    logger.info('  Admin:');
    logger.info('    Email: admin@inventario.com');
    logger.info('    Password: 123456\n');
    logger.info('  Clientes:');
    logger.info('    Email: maria@cliente.com | Password: 123456');
    logger.info('    Email: carlos@cliente.com | Password: 123456\n');

    process.exit(0);
  } catch (error) {
    logger.error('Error al crear datos de prueba:', error);
    process.exit(1);
  }
};

// Ejecutar script
seedData();
