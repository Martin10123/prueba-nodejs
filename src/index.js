/**
 * @fileoverview Archivo principal del servidor Express
 * @module index
 */

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { sequelize, testConnection } = require('./config/database');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

// Inicializar aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middlewares globales
 */

// Parser de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger HTTP (Morgan con Winston)
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.http(message.trim())
  }
}));

/**
 * Rutas de la API
 */
app.use('/api', routes);

/**
 * Manejo de errores y rutas no encontradas
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Inicialización del servidor
 */
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    const connected = await testConnection();
    
    if (!connected) {
      logger.error('No se pudo conectar a la base de datos. Abortando inicio del servidor.');
      process.exit(1);
    }

    // Sincronizar modelos con la base de datos
    // NOTA: En producción, usar migraciones en lugar de sync
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    logger.info('✓ Modelos sincronizados con la base de datos');

    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`
╔════════════════════════════════════════════════╗
║  🚀 Servidor iniciado exitosamente            ║
║  📡 Puerto: ${PORT}                              ║
║  🌍 Entorno: ${process.env.NODE_ENV || 'development'}            ║
║  📚 API Docs: http://localhost:${PORT}/api      ║
╚════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar servidor
startServer();

module.exports = app;