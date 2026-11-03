# Cart App

Microfrontend del carrito de compras de un usuario autenticado.

| | |
|---|---|
| **Puerto** | `5003` |
| **Rol en MF** | Remoto (también consume remotos) |
| **Estado** | 🟢 Completa: conectada a la API, verificada contra un mock; falta probarla con el backend real (ver [Roadmap, Fase 4](../Roadmap-Microfrontends.md)) |
| **API** | [`docs/openapi/cart.yaml`](../docs/openapi/cart.yaml), [`catalog.yaml`](../docs/openapi/catalog.yaml) (solo `GET /products/{id}`) |

## Rutas

El shell la monta en `/cart/*` dentro de su `ProtectedRoute`: sin sesión redirige a `/login` y vuelve aquí
tras iniciar sesión.

| Ruta | Página | Endpoints |
|---|---|---|
| `/cart` | `CartPage` | `GET /cart`, `PUT /cart/items/{productId}`, `DELETE /cart/items/{productId}`, `DELETE /cart` |

"Proceder al Checkout" navega a `/orders/checkout` (Orders App).

## Cómo funciona

- **Servicio** ([`cartService.js`](src/services/cartService.js)): todas las llamadas envían
  `Authorization: Bearer <token>` (token de `authApp/authService`). La API no documenta el cuerpo de las
  respuestas de escritura, así que después de cada acción se vuelve a pedir `GET /cart`.
- **Nombres de producto** ([`productService.js`](src/services/productService.js)): la API del carrito solo
  devuelve `productId`, `quantity` y `price`; los nombres y la categoría se completan con
  `GET /products/{id}` (con caché en memoria). Se puede eliminar cuando el backend enriquezca la respuesta
  (ver [backlog §12](../docs/backlog-mvp.md)).
- **Sincronización global** ([`CartSync`](src/components/CartSync.jsx) + [`useCartSync`](src/hooks/useCartSync.js)):
  el shell lo monta una vez en su layout. Procesa `CART_ADD_ITEM` desde cualquier página (`POST /cart/items`),
  publica el total real con `CART_UPDATED` y muestra un aviso flotante si agregar falla.

## Module Federation

**Expone**:

| Módulo | Contenido |
|---|---|
| `cartApp/CartApp` | Página del carrito |
| `cartApp/CartSync` | Componente sin UI (salvo avisos de error) que sincroniza el carrito desde cualquier página |

**Consume**:

| Alias | Uso | Variable de entorno | Fallback |
|---|---|---|---|
| `authApp` | `getToken`, `getSession`, `AUTH_SESSION_EVENT` | `VITE_AUTH_REMOTE_URL` | `http://localhost:5001/assets/remoteEntry.js` |

No consume `shellApp`: los nombres de eventos están en [`cartEvents.js`](src/services/cartEvents.js) para no
crear una dependencia circular shell ↔ cart. Deben coincidir con `shell/src/core/events/eventBus.js`.

**Compartido**: `react`, `react-dom`, `react-router-dom`.

## Eventos

| Evento | Rol | Payload |
|---|---|---|
| `ecommerce:cart-add-item` (`CART_ADD_ITEM`) | **Escucha** (`CartSync`): agrega al backend si hay sesión | `{ productId, quantity }` |
| `ecommerce:cart-updated` (`CART_UPDATED`) | **Emite** al cargar, tras cada cambio y al cambiar la sesión | `{ itemCount }` (suma de cantidades; 0 sin sesión) |
| `ecommerce:auth-session-change` | **Escucha** (`CartSync`): recalcula el total | `{ isAuthenticated, role, token }` |

## Variables de entorno

Se leen del `.env` de la raíz del monorepo (ver [`.env.example`](../.env.example)).

| Variable | Uso | Fallback |
|---|---|---|
| `VITE_AUTH_REMOTE_URL` | Remote consumido (build time) | ver tabla anterior |
| `VITE_CART_API_URL` | Base URL del Cart Service | `http://localhost:8083` |
| `VITE_CATALOG_API_URL` | Base URL del Catalog Service (nombres de producto) | `http://localhost:8082` |

## Desarrollo

```bash
npm run dev --workspace=cart-app   # build --watch + preview en 127.0.0.1:5003
```

En modo standalone necesita `auth-app` levantado. Fuera del shell no hay `ProtectedRoute`, así que sin
sesión la página muestra el error 401 del backend.

## Despliegue

Proyecto Vercel con *Root Directory* `cart-app/`. Ver [backlog §10](../docs/backlog-mvp.md).
