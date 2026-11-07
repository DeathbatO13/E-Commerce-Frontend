# Admin App

Microfrontend del panel de administración: catálogo, pedidos globales y usuarios.

| | |
|---|---|
| **Puerto** | `5005` |
| **Rol en MF** | Remoto (también consume remotos) |
| **Estado** | 🟢 Completa, verificada contra un mock (ver [Roadmap, Fase 6](../Roadmap-Microfrontends.md)) |
| **API** | Código del backend; difiere de [`catalog.yaml`](../docs/openapi/catalog.yaml) y [`auth.yaml`](../docs/openapi/auth.yaml) (ver [backlog §12](../docs/backlog-mvp.md)) y usa [`order.yaml`](../docs/openapi/order.yaml) |

## Rutas

El shell la monta en `/admin/*` y solo deja entrar a `ADMIN` y `SUPER_ADMIN` (`ProtectedRoute`). Es una
validación de UI: el backend sigue siendo la autoridad (regla 7).

| Ruta | Página | Endpoints | Rol |
|---|---|---|---|
| `/admin` | `DashboardPage`: indicadores y stock bajo | `GET /products`, `GET /categories`, `GET /orders` | `ADMIN`, `SUPER_ADMIN` |
| `/admin/products` | `ProductsPage`: listar, crear, editar, desactivar, reactivar | `GET`/`POST /products`, `PUT`/`DELETE /products/{id}` | `ADMIN`, `SUPER_ADMIN` |
| `/admin/categories` | `CategoriesPage`: crear, renombrar, eliminar | `GET`/`POST /categories`, `PUT`/`DELETE /categories/{id}` | `ADMIN`, `SUPER_ADMIN` |
| `/admin/orders` | `OrdersAdminPage`: pedidos de todos, filtro, cancelar | `GET /orders`, `POST /orders/{id}/cancel` | `ADMIN`, `SUPER_ADMIN` |
| `/admin/users` | `UsersPage`: listado y cambio de rol | `GET /admin/users`, `POST /admin/users/{id}/role?role=` | Listar: ambos. Cambiar rol: solo `SUPER_ADMIN` |

## Contratos (código del backend)

- **Producto**: `{ id, name, description, price, stock, categoryId, active }`. Alta con
  `{ name, description, price, stock, categoryId }`; edición con los mismos campos más `active` (reemplaza
  todo). `DELETE` desactiva; para reactivar se hace `PUT` con `active: true`.
- **Categoría**: `{ id, name, active }`. Alta y edición solo con `{ name }` (único: `409` si se repite).
  `DELETE` desactiva y responde `409` si la categoría tiene productos activos. No hay forma de reactivarla.
- **Usuario**: `{ id, email, roles, enabled }`. El rol se cambia con `?role=CLIENT|ADMIN`; el backend rechaza
  asignar `SUPER_ADMIN` (`400`) y cambiar el rol de un `SUPER_ADMIN` (`409`). El cambio reemplaza todos los roles.
- **Pedidos**: con rol admin, `GET /orders` devuelve los de todos y se puede cancelar cualquiera no pagado.

## Module Federation

**Expone**: `adminApp/AdminApp`.

**Consume**:

| Alias | Uso | Variable de entorno | Fallback |
|---|---|---|---|
| `authApp` | `authService.getToken` (cabecera `Authorization`) y `useAuthSession` (rol actual) | `VITE_AUTH_REMOTE_URL` | `http://localhost:5001/assets/remoteEntry.js` |

**Compartido**: `react`, `react-dom`, `react-router-dom`.

## Variables de entorno

Se leen del `.env` de la raíz del monorepo (ver [`.env.example`](../.env.example)).

| Variable | Uso | Fallback |
|---|---|---|
| `VITE_CATALOG_API_URL` | Productos y categorías | `http://localhost:8082` |
| `VITE_ORDER_API_URL` | Pedidos | `http://localhost:8084` |
| `VITE_AUTH_API_URL` | Usuarios y roles | `http://localhost:8081` |
| `VITE_AUTH_REMOTE_URL` | Remote consumido (build time) | ver tabla anterior |

## Desarrollo

```bash
npm run dev --workspace=admin-app   # build --watch + preview en 127.0.0.1:5005
```

En modo standalone necesita `auth-app` levantado (importa `authApp/*`) y se abre en
`http://localhost:5005/admin`. Ahí no hay guard de rol (lo pone el shell): el backend responde `403` si la
sesión no es de administrador.

> Con el backend real, su `CORS_ALLOWED_ORIGINS` debe incluir el origen del shell (`http://localhost:5000`).
> Ver [backlog §12](../docs/backlog-mvp.md).

## Despliegue

Proyecto Vercel con *Root Directory* `admin-app/`. Necesita conocer la URL de `auth-app` al compilar. Ver
[backlog §10](../docs/backlog-mvp.md).
