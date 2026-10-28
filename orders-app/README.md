# Orders App

Microfrontend de checkout, pago simulado e historial de pedidos.

| | |
|---|---|
| **Puerto** | `5004` |
| **Rol en MF** | Remoto |
| **Estado** | 🔴 Pendiente: hoy solo es un placeholder (ver [Roadmap, Fase 5](../Roadmap-Microfrontends.md)) |
| **API** | [`docs/openapi/order.yaml`](../docs/openapi/order.yaml), [`docs/openapi/payment.yaml`](../docs/openapi/payment.yaml) |

## Rutas previstas

El shell la monta en `/orders/*`. Ninguna está implementada todavía.

| Ruta | Página | Endpoint |
|---|---|---|
| `/orders/checkout` | Checkout (dirección de envío) | `POST /orders` |
| `/orders/:id/pay` | Pago simulado | `POST /payments/process` (`APPROVED` → `PAID`, `REJECTED` → sigue `CREATED`) |
| `/orders` | Historial del usuario | `GET /orders` |
| `/orders/:id` | Detalle (ítems, estado, total) | `GET /orders/{id}` |

Las rutas de checkout y pago son una propuesta; se confirman al implementar la fase. Todas requieren sesión.

> ⚠️ Antes de empezar, acordar con backend los huecos del contrato: `POST /orders` no documenta que devuelva
> el `orderId`, y no existe endpoint de cancelación (regla 4.3). Ver [backlog §12](../docs/backlog-mvp.md).

## Module Federation

**Expone**: `ordersApp/OrdersApp`. **Consume**: ninguno todavía (necesitará `authApp` para la sesión).
**Compartido**: `react`, `react-dom`, `react-router-dom`.

## Variables de entorno

Se leen del `.env` de la raíz del monorepo (ver [`.env.example`](../.env.example)). Aún no se usan.

| Variable | Uso previsto |
|---|---|
| `VITE_ORDER_API_URL` | Base URL del Order Service (`http://localhost:8084`) |
| `VITE_PAYMENT_API_URL` | Base URL del Payment Service (`http://localhost:8085`) |

## Desarrollo

```bash
npm run dev --workspace=orders-app   # build --watch + preview en 127.0.0.1:5004
```

## Despliegue

Proyecto Vercel con *Root Directory* `orders-app/`. Ver [backlog §10](../docs/backlog-mvp.md).
