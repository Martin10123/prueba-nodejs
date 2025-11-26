# API REST - Sistema de Inventario

API REST completa para gestión de inventario con autenticación JWT, roles de usuario (Admin/Cliente), y módulo de compras. Desarrollado con Node.js, Express, Sequelize y PostgreSQL.

## 📋 Características

- ✅ **Autenticación y Autorización**: JWT con roles (Administrador/Cliente)
- ✅ **CRUD de Productos**: Gestión completa del inventario (solo Admin)
- ✅ **Módulo de Compras**: Sistema de compras con control de stock
- ✅ **Facturas**: Generación de facturas detalladas
- ✅ **Historial**: Seguimiento de compras por cliente
- ✅ **Logs**: Sistema de logs con Winston
- ✅ **Validaciones**: Validación de datos con express-validator
- ✅ **Manejo de Errores**: Middleware global de captura de errores
- ✅ **Documentación**: Código documentado con JSDoc/ApiDoc

## 🛠️ Tecnologías

- **Node.js** v14+
- **Express** v5.1.0
- **Sequelize** (ORM)
- **PostgreSQL** (Base de datos)
- **JWT** (Autenticación)
- **bcryptjs** (Encriptación de contraseñas)
- **Winston** (Sistema de logs)
- **express-validator** (Validaciones)
- **Morgan** (HTTP logger)

## 📁 Estructura del Proyecto

```
ServidorNodejs/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de Sequelize
│   ├── controllers/
│   │   ├── authController.js    # Registro y login
│   │   ├── productController.js # CRUD de productos
│   │   └── purchaseController.js # Compras y facturas
│   ├── middlewares/
│   │   ├── auth.js              # Verificación JWT y roles
│   │   ├── errorHandler.js      # Manejo de errores
│   │   └── validators.js        # Validaciones
│   ├── models/
│   │   ├── User.js              # Modelo de usuario
│   │   ├── Product.js           # Modelo de producto
│   │   ├── Purchase.js          # Modelo de compra
│   │   ├── PurchaseDetail.js    # Modelo de detalle de compra
│   │   └── index.js             # Relaciones entre modelos
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   ├── productRoutes.js     # Rutas de productos
│   │   ├── purchaseRoutes.js    # Rutas de compras
│   │   └── index.js             # Rutas principales
│   ├── utils/
│   │   └── logger.js            # Configuración de Winston
│   └── index.js                 # Servidor principal
├── logs/                         # Archivos de logs
├── .env                          # Variables de entorno
├── .env.example                  # Ejemplo de variables
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Instalación

### Requisitos Previos

- Node.js v14 o superior
- PostgreSQL v12 o superior
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd ServidorNodejs
```

2. **Instalar dependencias**
```bash
npm install sequelize pg pg-hstore bcryptjs jsonwebtoken dotenv express-validator morgan winston
npm install --save-dev nodemon
```

3. **Configurar base de datos PostgreSQL**

Crear una base de datos en PostgreSQL:
```sql
CREATE DATABASE inventario_db;
```

4. **Configurar variables de entorno**

Copiar el archivo `.env.example` a `.env`:
```bash
copy .env.example .env
```

Editar el archivo `.env` con tus credenciales:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventario_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña

JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=24h

BCRYPT_ROUNDS=10
```

5. **Iniciar el servidor**

Modo desarrollo (con nodemon):
```bash
npm run dev
```

Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Documentación de la API

### Base URL
```
http://localhost:3000/api
```

### Endpoints Disponibles

#### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Registrar nuevo usuario | Público |
| POST | `/auth/login` | Iniciar sesión | Público |
| GET | `/auth/me` | Obtener usuario autenticado | Privado |

#### 📦 Productos (`/api/products`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/products` | Listar todos los productos | Admin |
| GET | `/products/:id` | Obtener producto por ID | Admin |
| POST | `/products` | Crear nuevo producto | Admin |
| PUT | `/products/:id` | Actualizar producto | Admin |
| DELETE | `/products/:id` | Eliminar producto | Admin |

#### 🛒 Compras (`/api/purchases`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/purchases` | Realizar compra | Cliente/Admin |
| GET | `/purchases/my-purchases` | Mi historial de compras | Cliente/Admin |
| GET | `/purchases/invoice/:id` | Ver factura específica | Cliente/Admin |
| GET | `/purchases/all` | Ver todas las compras | Admin |

---

## 📖 Ejemplos de Uso

### 1. Registrar Usuario

**Endpoint:** `POST /api/auth/register`

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "rol": "cliente"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "cliente"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Iniciar Sesión

**Endpoint:** `POST /api/auth/login`

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "cliente"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Crear Producto (Admin)

**Endpoint:** `POST /api/products`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "numeroLote": "LOT-001",
  "nombre": "Laptop HP",
  "precio": 1200.50,
  "cantidadDisponible": 10,
  "fechaIngreso": "2025-11-26"
}
```

### 4. Realizar Compra (Cliente)

**Endpoint:** `POST /api/purchases`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "productos": [
    {
      "productId": 1,
      "cantidad": 2
    },
    {
      "productId": 3,
      "cantidad": 1
    }
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Compra realizada exitosamente",
  "data": {
    "id": 1,
    "userId": 2,
    "fechaCompra": "2025-11-26T10:30:00.000Z",
    "total": "2500.00",
    "details": [
      {
        "id": 1,
        "cantidad": 2,
        "precioUnitario": "1200.50",
        "subtotal": "2401.00",
        "product": {
          "id": 1,
          "nombre": "Laptop HP",
          "numeroLote": "LOT-001"
        }
      }
    ]
  }
}
```

### 5. Ver Factura

**Endpoint:** `GET /api/purchases/invoice/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fechaCompra": "2025-11-26T10:30:00.000Z",
    "cliente": {
      "nombre": "Juan Pérez",
      "email": "juan@example.com"
    },
    "productos": [
      {
        "nombre": "Laptop HP",
        "numeroLote": "LOT-001",
        "cantidad": 2,
        "precioUnitario": 1200.50,
        "subtotal": 2401.00
      }
    ],
    "total": 2500.00
  }
}
```

### 6. Ver Todas las Compras (Admin)

**Endpoint:** `GET /api/purchases/all`

**Headers:**
```
Authorization: Bearer <token>
```

## 🔒 Autenticación

Todas las rutas privadas requieren un token JWT en el header:

```
Authorization: Bearer <tu_token_jwt>
```

El token se obtiene al registrarse o iniciar sesión.

## ⚡ Roles y Permisos

### Administrador (`admin`)
- ✅ CRUD completo de productos
- ✅ Ver todas las compras de todos los clientes
- ✅ Ver facturas de cualquier cliente
- ✅ Realizar compras (opcional)

### Cliente (`cliente`)
- ✅ Realizar compras
- ✅ Ver su historial de compras
- ✅ Ver sus propias facturas
- ❌ No puede gestionar productos

## 📊 Base de Datos

### Tablas

- **users**: Usuarios del sistema
- **products**: Productos del inventario
- **purchases**: Compras realizadas
- **purchase_details**: Detalles de cada compra

### Relaciones

- Un usuario tiene muchas compras
- Una compra pertenece a un usuario
- Una compra tiene muchos detalles
- Un detalle pertenece a una compra y a un producto

## 📝 Logs

Los logs se guardan en la carpeta `/logs`:

- `error.log`: Solo errores
- `combined.log`: Todos los logs

## 🧪 Pruebas

Puedes probar la API con:

- **Postman**: Importar colección de endpoints
- **Thunder Client** (VS Code)
- **curl** desde terminal

### Ejemplo con curl:

```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Admin\",\"email\":\"admin@example.com\",\"password\":\"123456\",\"rol\":\"admin\"}"

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"123456\"}"
```

## ⚠️ Consideraciones de Producción

1. **Cambiar JWT_SECRET** a un valor seguro y complejo
2. **Usar HTTPS** en lugar de HTTP
3. **Implementar rate limiting** para evitar ataques
4. **Usar migraciones de Sequelize** en lugar de `sync()`
5. **Configurar CORS** según tus necesidades
6. **Usar variables de entorno** seguras
7. **Implementar pruebas unitarias** y de integración

## 👤 Autor

Desarrollado como prueba técnica para posición de Desarrollador Backend

## 📄 Licencia

ISC

---

**¡Gracias por revisar este proyecto!** 🚀
