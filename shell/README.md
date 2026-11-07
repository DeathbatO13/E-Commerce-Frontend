# Shell (host)

Aplicación anfitriona del E-commerce. Monta el layout global (navbar + footer), define el enrutamiento
principal y carga en runtime los microfrontends remotos vía Module Federation.

| | |
|---|---|
| **Puerto** | `5000` |
| **Rol en MF** | Host + remoto (expone componentes compartidos) |
| **Estado** | 🟡 Parcial (ver [Roadmap, Fase 1](../Roadmap-Microfrontends.md)) |

## Rutas

| Ruta | Remoto montado | Layout |
|---|---|---|
| `/login`, `/register` | `authApp/AuthApp` | Pantalla completa (sin `MainLayout`) |
| `/cart/*` | `cartApp/CartApp` | `MainLayout` · requiere sesión |
| `/orders/*` | `ordersApp/OrdersApp` | `MainLayout` · requiere sesión |
| `/admin/*` | `adminApp/AdminApp` | `MainLayout` · requiere rol `ADMIN` o `SUPER_ADMIN` |
| `/`, `/products/:id` | `catalogApp/CatalogApp` | `MainLayout` |
| Cualquier otra ruta | `NotFoundPage` (404, renderizada por Catalog App vía `notFound`) | `MainLayout` |

Definidas en [`src/app/routes/AppRouter.jsx`](src/app/routes/AppRouter.jsx).

- **Rutas protegidas** ([`ProtectedRoute.jsx`](src/app/routes/ProtectedRoute.jsx)): sin sesión redirige a
  `/login` guardando la ruta en `state.from` (auth-app vuelve ahí tras el login); con sesión pero sin el rol
  requerido redirige a `/`. Es validación de UI: el backend sigue siendo la autoridad.
- **`CartSync`**: `MainLayout` monta `cartApp/CartSync` en todas las páginas para procesar `CART_ADD_ITEM`.
  Va dentro de [`RemoteErrorBoundary`](src/app/components/RemoteErrorBoundary.jsx): si cart-app no carga, el
  resto del layout sigue funcionando.
- **Remoto caído**: `RemoteBoundary` (en `AppRouter.jsx`) muestra "Esta sección no está disponible" con
  "Reintentar"; navbar y footer siguen funcionando y cambiar de sección reinicia el boundary. `auth-app` es la
  excepción: `ProtectedRoute` y `TopNavBar` lo importan de forma estática, así que sin él el shell no arranca.
- **Navbar**: botón "Iniciar sesión" o `UserMenu` según la sesión, y buscador que publica `/?q=...` para Catalog App.

## Module Federation

**Consume** (`remotes`):

| Alias | Variable de entorno | Fallback local |
|---|---|---|
| `authApp` | `VITE_AUTH_REMOTE_URL` | `http://localhost:5001/assets/remoteEntry.js` |
| `catalogApp` | `VITE_CATALOG_REMOTE_URL` | `http://localhost:5002/assets/remoteEntry.js` |
| `cartApp` | `VITE_CART_REMOTE_URL` | `http://localhost:5003/assets/remoteEntry.js` |
| `ordersApp` | `VITE_ORDERS_REMOTE_URL` | `http://localhost:5004/assets/remoteEntry.js` |
| `adminApp` | `VITE_ADMIN_REMOTE_URL` | `http://localhost:5005/assets/remoteEntry.js` |

**Expone** (`exposes`):

| Módulo | Archivo |
|---|---|
| `shellApp/TopNavBar` | `src/shared/components/TopNavBar.jsx` |
| `shellApp/Footer` | `src/shared/components/Footer.jsx` |
| `shellApp/eventBus` | `src/core/events/eventBus.js` |

**Compartido** (`shared`): `react`, `react-dom`, `react-router-dom`.

## Eventos

El bus ([`eventBus.js`](src/core/events/eventBus.js)) usa `CustomEvent` sobre `window`.

| Evento | Constante | Rol del shell |
|---|---|---|
| `ecommerce:cart-add-item` | `CART_ADD_ITEM` | No lo escucha: lo emite Catalog App y lo procesa `cartApp/CartSync`. |
| `ecommerce:cart-updated` | `CART_UPDATED` | **Escucha**: `useCartBadge` muestra `itemCount` en el navbar (último valor en `localStorage` como `ecommerce.cartCount`). |
| `ecommerce:auth-session-change` | `AUTH_SESSION_CHANGE` | `ProtectedRoute` y el navbar reaccionan a él vía `authApp/useAuth`. |

## Variables de entorno

Se leen del `.env` de la **raíz del monorepo** (`envDir`); ver [`.env.example`](../.env.example). Solo usa las
variables `VITE_*_REMOTE_URL` de la tabla anterior. Se resuelven en **build time**: si cambia la URL de un
remoto hay que recompilar el shell.

## Desarrollo

```bash
# Desde la raíz: levanta el shell y los 5 remotos
npm run dev:all

# Solo el shell, con HMR (vite dev)
npm run dev --workspace=shell

# Shell como remoto (build --watch + preview), necesario si otro remoto consume shellApp/*
npm run dev:mf --workspace=shell
```

> **Limitación conocida:** `@originjs/vite-plugin-federation` solo genera `remoteEntry.js` al compilar. Con
> `npm run dev` (modo `vite` dev) el shell no publica `shellApp/eventBus`, y `catalog-app`, que lo
> importa, no puede resolverlo. Usa `dev:mf` en ese caso. Ver backlog §1.

## Despliegue

Proyecto Vercel propio con *Root Directory* `shell/`. Se despliega **después** de los remotos, con las
variables `VITE_*_REMOTE_URL` apuntando a sus dominios. Detalle en [backlog §10](../docs/backlog-mvp.md).
