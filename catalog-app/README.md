# Catalog App

Microfrontend público del catálogo: listado de productos con filtros por categoría y disponibilidad, y
vista de detalle con el botón "Agregar al carrito".

| | |
|---|---|
| **Puerto** | `5002` |
| **Rol en MF** | Remoto (también consume remotos) |
| **Estado** | 🟢 Completa (ver [Roadmap, Fase 3](../Roadmap-Microfrontends.md)) |
| **API** | [`docs/openapi/catalog.yaml`](../docs/openapi/catalog.yaml) |

## Rutas

El shell la monta en `/` y como ruta por defecto.

| Ruta | Página | Endpoints |
|---|---|---|
| `/` | `CatalogPage` | `GET /categories`, `GET /products?categoryId&active` |
| `/products/:id` | `ProductDetailPage` | `GET /products/{id}` |

La paginación y el filtro por rango de precio son solo visuales: la API no los soporta (ver
[backlog §12](../docs/backlog-mvp.md)).

## Module Federation

**Expone**: `catalogApp/CatalogApp`.

**Consume**:

| Alias | Uso | Variable de entorno | Fallback |
|---|---|---|---|
| `shellApp` | `eventBus` (`emit`, `CART_ADD_ITEM`) | `VITE_SHELL_REMOTE_URL` | `http://localhost:5000/assets/remoteEntry.js` |
| `authApp` | `authService.getSession` | `VITE_AUTH_REMOTE_URL` | `http://localhost:5001/assets/remoteEntry.js` |

**Compartido**: `react`, `react-dom`, `react-router-dom`.

> Hay una dependencia circular: el shell consume `catalogApp` y catalog consume `shellApp`. Ver backlog §1.

## Eventos

| Evento | Rol | Payload |
|---|---|---|
| `ecommerce:cart-add-item` (`CART_ADD_ITEM`) | **Emite** al agregar al carrito, solo con sesión activa (sin sesión redirige a `/login`) | `{ productId, quantity: 1 }` |

Hoy solo el badge del shell escucha este evento: `cart-app` todavía no lo procesa.

## Variables de entorno

Se leen del `.env` de la raíz del monorepo (ver [`.env.example`](../.env.example)).

| Variable | Uso | Fallback |
|---|---|---|
| `VITE_CATALOG_API_URL` | Base URL del Catalog Service | `http://localhost:8082` |
| `VITE_SHELL_REMOTE_URL`, `VITE_AUTH_REMOTE_URL` | Remotes consumidos (build time) | ver tabla anterior |

## Desarrollo

```bash
npm run dev --workspace=catalog-app   # build --watch + preview en 127.0.0.1:5002
```

En modo standalone necesita que `auth-app` y el shell **como remoto** (`npm run dev:mf --workspace=shell`)
estén levantados, porque importa `authApp/*` y `shellApp/*`.

## Despliegue

Proyecto Vercel con *Root Directory* `catalog-app/`. Necesita conocer las URLs de `shell` y `auth-app` al
compilar. Ver [backlog §10](../docs/backlog-mvp.md).
