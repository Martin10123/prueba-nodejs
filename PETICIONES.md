# 🧪 Guía de Peticiones - API Inventario

## 📋 Base URL
```
http://localhost:3000/api
```

---

## 🔐 1. AUTENTICACIÓN

### Registrar Usuario Administrador
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nombre": "Admin Principal",
  "email": "admin@test.com",
  "password": "123456",
  "rol": "admin"
}
```

### Registrar Usuario Cliente
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@test.com",
  "password": "123456",
  "rol": "cliente"
}
```

### Login
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
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
    "nombre": "Admin Principal",
    "email": "admin@test.com",
    "rol": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ IMPORTANTE: Copia el token para usarlo en las siguientes peticiones**

### Obtener Usuario Actual
```bash
GET http://localhost:3000/api/auth/me
Authorization: Bearer TU_TOKEN_AQUI
```

---

## 📦 2. PRODUCTOS (Solo Admin)

### Listar Todos los Productos
```bash
GET http://localhost:3000/api/products
Authorization: Bearer TU_TOKEN_ADMIN
```

### Obtener Producto por ID
```bash
GET http://localhost:3000/api/products/1
Authorization: Bearer TU_TOKEN_ADMIN
```

### Crear Producto
```bash
POST http://localhost:3000/api/products
Authorization: Bearer TU_TOKEN_ADMIN
Content-Type: application/json

{
  "numeroLote": "LOT-2025-001",
  "nombre": "Laptop Dell Inspiron 15",
  "precio": 1200.00,
  "cantidadDisponible": 15,
  "fechaIngreso": "2025-11-27"
}
```

### Crear Más Productos (Ejemplo)
```bash
POST http://localhost:3000/api/products
Authorization: Bearer TU_TOKEN_ADMIN
Content-Type: application/json

{
  "numeroLote": "LOT-2025-002",
  "nombre": "Mouse Logitech MX Master 3",
  "precio": 99.99,
  "cantidadDisponible": 50,
  "fechaIngreso": "2025-11-27"
}
```

```bash
POST http://localhost:3000/api/products
Authorization: Bearer TU_TOKEN_ADMIN
Content-Type: application/json

{
  "numeroLote": "LOT-2025-003",
  "nombre": "Teclado Mecánico Corsair K70",
  "precio": 159.99,
  "cantidadDisponible": 30,
  "fechaIngreso": "2025-11-27"
}
```

### Actualizar Producto
```bash
PUT http://localhost:3000/api/products/1
Authorization: Bearer TU_TOKEN_ADMIN
Content-Type: application/json

{
  "precio": 1150.00,
  "cantidadDisponible": 20
}
```

### Eliminar Producto
```bash
DELETE http://localhost:3000/api/products/1
Authorization: Bearer TU_TOKEN_ADMIN
```

---

## 🛒 3. COMPRAS (Cliente)

### Realizar Compra (Un Producto)
```bash
POST http://localhost:3000/api/purchases
Authorization: Bearer TU_TOKEN_CLIENTE
Content-Type: application/json

{
  "productos": [
    {
      "productId": 1,
      "cantidad": 2
    }
  ]
}
```

### Realizar Compra (Múltiples Productos)
```bash
POST http://localhost:3000/api/purchases
Authorization: Bearer TU_TOKEN_CLIENTE
Content-Type: application/json

{
  "productos": [
    {
      "productId": 1,
      "cantidad": 2
    },
    {
      "productId": 2,
      "cantidad": 3
    },
    {
      "productId": 3,
      "cantidad": 1
    }
  ]
}
```

### Ver Mi Historial de Compras
```bash
GET http://localhost:3000/api/purchases/my-purchases
Authorization: Bearer TU_TOKEN_CLIENTE
```

### Ver Factura Específica
```bash
GET http://localhost:3000/api/purchases/invoice/1
Authorization: Bearer TU_TOKEN_CLIENTE
```

---

## 📊 4. COMPRAS (Admin)

### Ver Todas las Compras de Todos los Clientes
```bash
GET http://localhost:3000/api/purchases/all
Authorization: Bearer TU_TOKEN_ADMIN
```

## 🧪 FLUJO COMPLETO DE PRUEBA

### Paso 1: Registrar y Login como Admin
```bash
1. POST /api/auth/register (rol: admin)
2. POST /api/auth/login
3. Guardar el token
```

### Paso 2: Crear Productos
```bash
4. POST /api/products (crear 3-5 productos)
5. GET /api/products (verificar que se crearon)
```

### Paso 3: Registrar y Login como Cliente
```bash
6. POST /api/auth/register (rol: cliente)
7. POST /api/auth/login
8. Guardar el token del cliente
```

### Paso 4: Realizar Compras
```bash
9. POST /api/purchases (comprar varios productos)
10. GET /api/purchases/my-purchases (ver historial)
11. GET /api/purchases/invoice/1 (ver factura)
```

### Paso 5: Verificar como Admin
```bash
12. GET /api/purchases/all (con token admin - ver todas las compras)
```

---

## 📝 NOTAS IMPORTANTES

1. **Token de Autorización**: Después del login, copia el token y úsalo en el header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Roles**:
   - `admin`: Puede gestionar productos y ver todas las compras
   - `cliente`: Puede realizar compras y ver su historial

3. **Stock**: Al realizar una compra, el stock se reduce automáticamente

4. **Validaciones**:
   - Email único
   - Password mínimo 6 caracteres
   - Precio > 0
   - Cantidad >= 0
   - Stock suficiente para compras

---

## 🔍 ERRORES COMUNES

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token no proporcionado. Acceso denegado."
}
```
**Solución**: Incluir header `Authorization: Bearer TOKEN`

### 403 Forbidden
```json
{
  "success": false,
  "message": "Acceso denegado. Se requieren permisos de administrador."
}
```
**Solución**: Usar token de un usuario con rol `admin`

### 400 Bad Request - Stock Insuficiente
```json
{
  "success": false,
  "message": "Stock insuficiente para el producto \"Laptop\". Disponible: 5, Solicitado: 10"
}
```
**Solución**: Reducir la cantidad solicitada o aumentar el stock

### 409 Conflict - Email Duplicado
```json
{
  "success": false,
  "message": "El email ya existe en el sistema."
}
```
**Solución**: Usar un email diferente

---

## 🎯 DATOS DE PRUEBA RÁPIDOS

Si ejecutaste `npm run seed`, puedes usar:

**Admin:**
- Email: `admin@inventario.com`
- Password: `123456`

**Clientes:**
- Email: `maria@cliente.com` - Password: `123456`
- Email: `carlos@cliente.com` - Password: `123456`
