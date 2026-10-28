# Cart App

Microfrontend del carrito de compras de un usuario autenticado.

| | |
|---|---|
| **Puerto** | `5003` |
| **Rol en MF** | Remoto (también consume remotos) |
| **Estado** | 🟡 Parcial: UI lista sobre **datos mock** (ver [Roadmap, Fase 4](../Roadmap-Microfrontends.md)) |
| **API** | [`docs/openapi/cart.yaml`](../docs/openapi/cart.yaml) |

## Rutas

| Ruta | Página | Estado |
|---|---|---|
| `/cart` | `CartPage` | Lista ítems, cambia cantidades y muestra el resumen. Redirige a `/login` sin sesión. |

## Estado actual (importante)

- [`src/services/cartService.js`](src/services/cartService.js) **no llama al backend**: devuelve datos
  fijos con `setTimeout`. Faltan `GET /cart`, `POST /cart/items`, `PUT /cart/items/{productId}`,
  `DELETE /cart/items/{productId}` y `DELETE /cart` con `Authorization: Bearer <token>`.
- No escucha el evento `CART_ADD_ITEM`, así que lo que se agrega desde el catálogo no llega al carrito.
- No hay botón para eliminar un ítem ni para vaciar el carrito.
- "Proceder al Checkout" no navega a Orders App todavía.

Detalle en [backlog §4](../docs/backlog-mvp.md).

## Module Federation

**Expone**: `cartApp/CartApp`.

**Consume**:

| Alias | Uso | Variable de entorno | Fallback |
|---|---|---|---|
| `authApp` | `authService.getSession` | `VITE_AUTH_REMOTE_URL` | `http://localhost:5001/assets/remoteEntry.js` |

Para escuchar `CART_ADD_ITEM` tendrá que consumir también `shellApp/eventBus`.

**Compartido**: `react`, `react-dom`, `react-router-dom`.

## Variables de entorno

Se leen del `.env` de la raíz del monorepo (ver [`.env.example`](../.env.example)).

| Variable | Uso | Fallback |
|---|---|---|
| `VITE_AUTH_REMOTE_URL` | Remote consumido (build time) | ver tabla anterior |
| `VITE_CART_API_URL` | Base URL del Cart Service (aún no se usa: el servicio es mock) | `http://localhost:8083` (en `.env.example`) |

## Desarrollo

```bash
npm run dev --workspace=cart-app   # build --watch + preview en 127.0.0.1:5003
```

En modo standalone necesita `auth-app` levantado.

## Despliegue

Proyecto Vercel con *Root Directory* `cart-app/`. Ver [backlog §10](../docs/backlog-mvp.md).
