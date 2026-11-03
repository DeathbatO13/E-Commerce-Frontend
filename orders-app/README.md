# Orders App

Microfrontend de checkout, pago simulado e historial de pedidos.

| | |
|---|---|
| **Puerto** | `5004` |
| **Rol en MF** | Remoto (también consume remotos) |
| **Estado** | 🟢 Completa, verificada contra un mock (ver [Roadmap, Fase 5](../Roadmap-Microfrontends.md)) |
| **API** | [`docs/openapi/order.yaml`](../docs/openapi/order.yaml), [`docs/openapi/payment.yaml`](../docs/openapi/payment.yaml) |

## Rutas

El shell la monta en `/orders/*` y exige sesión (`ProtectedRoute`).

| Ruta | Página | Endpoints |
|---|---|---|
| `/orders/checkout` | `CheckoutPage`: resumen del carrito y dirección de envío | `GET /cart`, `POST /orders` |
| `/orders/:id/pay` | `PaymentPage`: pago simulado (aprobar o rechazar) | `GET /orders/{id}`, `POST /payments/process` |
| `/orders` | `OrdersPage`: historial del usuario | `GET /orders` |
| `/orders/:id` | `OrderDetailPage`: ítems, estado y total; pagar o cancelar si está `CREATED` | `GET /orders/{id}`, `POST /orders/{id}/cancel` |

Los nombres de producto se completan con `GET /products/{id}` del Catalog Service, porque ni el carrito ni
los pedidos los devuelven (ver [backlog §12](../docs/backlog-mvp.md)).

## Flujo de compra

1. Cart App navega a `/orders/checkout`.
2. `POST /orders` con `{ address }`. El backend copia el carrito, valida precios y lo vacía. Responde `201`
   sin cuerpo y con `Location: /orders/{id}`; si esa cabecera no se pudiera leer, se toma el pedido `CREATED`
   más reciente de `GET /orders`. Se emite `CART_UPDATED` con `itemCount: 0`.
3. `/orders/:id/pay` llama a `POST /payments/process` con `{ orderId, amount, simulateResult }`. `amount`
   tiene que ser el total exacto del pedido.
   - `APPROVED`: el pedido pasa a `PAID` y se vuelve al detalle con un aviso.
   - `REJECTED`: el pedido sigue `CREATED` y se puede reintentar.
4. Un pedido `CREATED` se puede cancelar desde el detalle (regla 4.3). Uno `PAID` no (el backend responde `409`).

## Module Federation

**Expone**: `ordersApp/OrdersApp`.

**Consume**:

| Alias | Uso | Variable de entorno | Fallback |
|---|---|---|---|
| `authApp` | `authService.getToken` (cabecera `Authorization`) | `VITE_AUTH_REMOTE_URL` | `http://localhost:5001/assets/remoteEntry.js` |

**Compartido**: `react`, `react-dom`, `react-router-dom`.

## Eventos

| Evento | Rol | Payload |
|---|---|---|
| `ecommerce:cart-updated` (`CART_UPDATED`) | **Emite** al crear el pedido, porque el backend vacía el carrito | `{ itemCount: 0 }` |

Usa el nombre del evento directamente sobre `window`, sin importar `shellApp/eventBus` ni `cartApp`.

## Variables de entorno

Se leen del `.env` de la raíz del monorepo (ver [`.env.example`](../.env.example)).

| Variable | Uso | Fallback |
|---|---|---|
| `VITE_ORDER_API_URL` | Base URL del Order Service | `http://localhost:8084` |
| `VITE_PAYMENT_API_URL` | Base URL del Payment Service | `http://localhost:8085` |
| `VITE_CART_API_URL` | Resumen del carrito en el checkout | `http://localhost:8083` |
| `VITE_CATALOG_API_URL` | Nombres de producto | `http://localhost:8082` |
| `VITE_AUTH_REMOTE_URL` | Remote consumido (build time) | ver tabla anterior |

## Desarrollo

```bash
npm run dev --workspace=orders-app   # build --watch + preview en 127.0.0.1:5004
```

En modo standalone necesita `auth-app` levantado (importa `authApp/authService`) y se abre en
`http://localhost:5004/orders`.

> Con el backend real, su `CORS_ALLOWED_ORIGINS` debe incluir el origen del shell (`http://localhost:5000`);
> hoy no lo incluye. Ver [backlog §12](../docs/backlog-mvp.md).

## Despliegue

Proyecto Vercel con *Root Directory* `orders-app/`. Necesita conocer la URL de `auth-app` al compilar. Ver
[backlog §10](../docs/backlog-mvp.md).
