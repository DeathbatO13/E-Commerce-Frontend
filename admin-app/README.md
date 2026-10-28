# Admin App

Microfrontend del panel de administración: catálogo, pedidos globales y usuarios.

| | |
|---|---|
| **Puerto** | `5005` |
| **Rol en MF** | Remoto |
| **Estado** | 🔴 Pendiente: hoy solo es un placeholder (ver [Roadmap, Fase 6](../Roadmap-Microfrontends.md)) |
| **API** | [`docs/openapi/catalog.yaml`](../docs/openapi/catalog.yaml), [`order.yaml`](../docs/openapi/order.yaml), [`auth.yaml`](../docs/openapi/auth.yaml) |

## Rutas previstas

El shell la monta en `/admin/*`. Ninguna está implementada todavía. Todas requieren rol `ADMIN` o
`SUPER_ADMIN` (validación solo de UI: el backend sigue siendo la autoridad, regla 7).

| Ruta | Sección | Endpoints | Rol |
|---|---|---|---|
| `/admin/products` | CRUD de productos y categorías | `POST/PUT/DELETE /products`, `/categories` | `ADMIN`, `SUPER_ADMIN` |
| `/admin/orders` | Pedidos de todos los usuarios | `GET /orders` | `ADMIN`, `SUPER_ADMIN` |
| `/admin/users` | Usuarios y roles | `GET /users`, `POST /users`, `PUT /users/{id}/role` | Cambiar roles: solo `SUPER_ADMIN` |

> ⚠️ Pendiente de decisión: la regla 6.2 permite a `ADMIN` **listar** usuarios, pero el roadmap original
> reservaba toda la sección a `SUPER_ADMIN`. Ver [backlog §12](../docs/backlog-mvp.md).

## Module Federation

**Expone**: `adminApp/AdminApp`. **Consume**: ninguno todavía (necesitará `authApp` para el guard de rol).
**Compartido**: `react`, `react-dom`, `react-router-dom`.

## Variables de entorno

Se leen del `.env` de la raíz del monorepo (ver [`.env.example`](../.env.example)). Aún no se usan; usará
`VITE_CATALOG_API_URL`, `VITE_ORDER_API_URL` y `VITE_AUTH_API_URL`.

## Desarrollo

```bash
npm run dev --workspace=admin-app   # build --watch + preview en 127.0.0.1:5005
```

## Despliegue

Proyecto Vercel con *Root Directory* `admin-app/`. Ver [backlog §10](../docs/backlog-mvp.md).
