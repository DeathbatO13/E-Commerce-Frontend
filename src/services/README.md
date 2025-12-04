# Servicios de Autenticación - E-Commerce Frontend

## Descripción

Esta carpeta contiene los servicios centralizados para manejar todas las peticiones de autenticación al backend. La arquitectura está diseñada para facilitar la integración futura con el backend real de Spring Boot.

## Estructura

### `api.js`
Instancia base de **axios** configurada para el backend.

**Características:**
- Base URL: `http://localhost:8080/api` (configurable en una sola línea)
- Timeout: 10 segundos
- Headers por defecto: `Content-Type: application/json`
- Interceptor de respuestas para manejo global de errores (p. ej., 401 Unauthorized)

**Cambiar el servidor es tan simple como:**
```javascript
// Cambiar esta línea en api.js
baseURL: "http://tu-servidor:puerto/api",
```

### `authService.js`
Funciones de autenticación que usan la instancia de axios centralizada.

**Funciones disponibles:**

#### `login(email, password)`
Realiza el login del usuario.
```javascript
import { login } from '@/services/authService';

const response = await login('user@email.com', 'password123');
// Retorna: { token, user, ... } (según respuesta del backend)
```

#### `register(userData)`
Registra un nuevo usuario.
```javascript
import { register } from '@/services/authService';

const response = await register({
  fullName: 'John Doe',
  email: 'john@email.com',
  password: 'password123'
});
// Retorna: { token, user, ... }
```

#### `recoverPassword(email)`
Solicita recuperación de contraseña.
```javascript
import { recoverPassword } from '@/services/authService';

const response = await recoverPassword('user@email.com');
// Retorna: { message, ... }
```

#### `logout()`
Limpia el token del localStorage.
```javascript
import { logout } from '@/services/authService';

logout();
```

#### `getToken()`
Obtiene el token del localStorage.
```javascript
import { getToken } from '@/services/authService';

const token = getToken();
if (!token) {
  // Redirigir a login
}
```

## Flujo de una petición

1. **Página (LoginPage.jsx)** llama `login(email, password)`
2. **authService.js** valida y llama `api.post('/auth/login', data)`
3. **api.js** realiza la petición a `http://localhost:8080/api/auth/login`
4. **Respuesta:** `authService.js` guarda el token en `localStorage` y retorna la respuesta
5. **Página** maneja la respuesta o error

## Manejo de errores

Todos los servicios usan `try/catch`:

```javascript
try {
  const response = await login(email, password);
  // Success
} catch (error) {
  const serverMessage = error?.response?.data?.message; // Mensaje del backend
  const statusCode = error?.response?.status; // Código HTTP
  // Manejar error
}
```

## Rutas esperadas del backend

El backend de Spring Boot debe implementar estos endpoints:

| Método | Ruta | Body | Response |
|--------|------|------|----------|
| POST | `/api/auth/login` | `{ email, password }` | `{ token, user, ... }` |
| POST | `/api/auth/register` | `{ name, email, password }` | `{ token, user, ... }` |
| POST | `/api/auth/recover` | `{ email }` | `{ message, ... }` |

**Ejemplo de respuesta esperada:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@email.com"
  },
  "message": "Success"
}
```

## Próximos pasos

1. **Backend listo?** Solo cambia la URL base en `api.js` (línea 10)
2. **Autenticación con token?** Actualiza el interceptor de axios en `api.js` para incluir el header `Authorization: Bearer ${token}`
3. **Validación avanzada?** Integra `react-hook-form` + `zod` en las páginas
4. **Tests?** Crea mocks de `authService` para unit tests

## Ejemplo: Conectar con el backend real

**Paso 1:** Backend disponible en `http://api.tudominio.com/api`

```javascript
// src/services/api.js - Línea 10
baseURL: "http://api.tudominio.com/api",
```

**Paso 2:** El backend retorna un JWT token

```javascript
// src/services/authService.js - login()
if (response.data?.token) {
  localStorage.setItem("token", response.data.token);
  // Opcionalmente, actualizar interceptor para incluir header Authorization
}
```

**Paso 3:** Usar el token en peticiones subsecuentes

```javascript
// En api.js - Interceptor de requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

¡Listo! Sin cambios en las páginas.

