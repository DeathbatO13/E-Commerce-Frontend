# 🚀 Hoja de Ruta: E-commerce MVP - Microfrontends

Basado en la arquitectura hexagonal del backend, el sistema de Microfrontends (Module Federation con `@originjs/vite-plugin-federation`), las reglas de negocio y las especificaciones de OpenAPI, esta es la hoja de ruta y el desglose de tareas paso a paso para completar el desarrollo frontend.

> **Cómo leer este documento:** el Roadmap define *qué* se entrega por fase. El desglose técnico granular
> (bugs conocidos, deuda, decisiones pendientes) vive en [`docs/backlog-mvp.md`](./docs/backlog-mvp.md).
>
> Leyenda: `[x]` hecho · `[~]` parcial (ver nota) · `[ ]` pendiente.
>
> Última sincronización con el código: 2026-10-28.

## 📊 Estado por fase

| Fase | App | Avance | Resumen |
|---|---|---|---|
| 1 | Shell | 🟡 Parcial | Router, MF, bus de eventos, rutas protegidas, sesión en el header, 404 y aviso de remoto caído listos. Falta el UI Kit. |
| 2 | Auth App | 🟢 Completa | Login, registro, JWT y `useAuthSession` expuestos. |
| 3 | Catalog App | 🟢 Completa | Listado, filtro por categoría y disponibilidad, y detalle con el `ProductResponse` real del backend. |
| 4 | Cart App | 🟢 Completa* | Conectada a la API y a `CART_ADD_ITEM`. *Verificada contra un mock; falta probarla con el backend real. |
| 5 | Orders App | 🟢 Completa* | Checkout, pago simulado, historial y detalle con cancelación. *Verificada contra un mock; el CORS del backend aún no admite el shell. |
| 6 | Admin App | 🟢 Completa* | Resumen, CRUD de catálogo, pedidos globales y roles. *Verificada contra un mock. |
| 7 | Calidad y testing | 🔴 Pendiente | Sin tests, sin interceptor de errores. |
| 8 | Despliegue Vercel + CI/CD | 🔴 Pendiente | Remotes ya parametrizados por entorno; falta todo lo demás. |

---

## 🏗️ Fase 1: Fundaciones y Arquitectura Base (Shell App)

El **Shell App** es la aplicación anfitriona que orquesta la carga de todos los microfrontends, gestiona el enrutamiento principal y los estados globales transversales (como la sesión del usuario).

### Tareas (Shell):
- [x] Inicializar el monorepo con Turborepo + npm workspaces.
- [x] Configurar el **Shell App** con React y Vite (Module Federation).
- [x] Parametrizar las URLs de los remotes por entorno (`loadEnv` + `.env` en la raíz, ver `.env.example`).
- [x] Definir e implementar el sistema de enrutamiento principal (`react-router-dom`).
  - Rutas `/login`, `/register`, `/cart`, `/orders/*`, `/admin/*` y catálogo en `/`, con página 404 y aviso si un remoto no carga.
- [ ] **UI Kit Compartido (Shared Library):** Crear un paquete interno o design system con Tailwind CSS para componentes comunes (Botones, Inputs, Modales, Tablas, Headers) y un preset de Tailwind común.
- [x] Implementar un bus de eventos (`CustomEvents`) para comunicar remotos (`shell/src/core/events/eventBus.js`, expuesto como `shellApp/eventBus`).
- [x] Integrar un Header global en el Shell con la navegación principal, acceso a login/perfil y el "Mini Cart".
  - Badge del carrito sincronizado con el backend (`useCartBadge` + `CART_UPDATED`).
  - Botón de login o menú de usuario según la sesión (pedidos, panel por rol, cerrar sesión) y buscador (`/?q=`).
- [x] Rutas protegidas (`ProtectedRoute`) para `/cart/*`, `/orders/*` y `/admin/*` (rol `ADMIN`/`SUPER_ADMIN`), con redirección a `/login` y retorno a la página de origen.

---

## 🔐 Fase 2: Auth App (Microfrontend de Autenticación)

Este microfrontend maneja el registro, inicio de sesión y almacenamiento de los tokens. Se inyecta en el Shell y provee el estado de autenticación al resto de la aplicación.

### Tareas (Auth App):
- [x] Inicializar el microfrontend `auth-app` y su configuración de exposición en Module Federation.
- [x] **Página de Login (`/login`)**:
  - [x] Implementar formulario con validaciones (Email y Password).
  - [x] Integrar llamada a `POST /auth/login`.
  - [x] Manejo de JWT: guardar en `localStorage` y emitir el evento `ecommerce:auth-session-change`.
- [x] **Página de Registro (`/register`)**:
  - [x] Implementar formulario (Nombre, Email, Password).
  - [x] Integrar llamada a `POST /auth/register` (crea usuario con rol `CLIENT`).
  - [x] Flujo de redirección al login post-registro.
- [x] Exponer funciones utilitarias o Hooks para verificar si hay sesión activa, extraer roles del JWT (`CLIENT`, `ADMIN`, `SUPER_ADMIN`) y ejecutar logout.
- [x] Redirección post-login a la página de origen (`state.from`).
- [ ] Expiración proactiva de sesión cuando el token vence mientras se navega.

---

## 🛍️ Fase 3: Catalog App (Microfrontend de Catálogo)

Microfrontend de acceso público. Responsable de mostrar productos, categorías y vista detallada.

### Tareas (Catalog App):
- [x] Inicializar el microfrontend `catalog-app`.
- [x] **Listado de Categorías**:
  - [x] Integrar `GET /categories`.
  - [x] Crear componente de filtros laterales de categorías.
- [x] **Listado de Productos (`/`)**:
  - [x] Integrar `GET /products` (filtro por `categoryId` en la API; "In Stock Only" en el cliente, porque la API no filtra por `active`).
  - [x] Nombre de categoría resuelto desde `categoryId` y disponibilidad según `active` y `stock`.
  - [x] Construir grid de tarjetas de producto mostrando información básica y precio.
- [x] **Detalle del Producto (`/products/{id}`)**:
  - [x] Integrar `GET /products/{id}`.
  - [x] Botón "Agregar al Carrito" que emite `CART_ADD_ITEM` por el `eventBus` (requiere sesión).
- [ ] Paginación y filtro por rango de precio: hoy son solo visuales (la API no soporta paginación, ver backlog §12).

---

## 🛒 Fase 4: Cart App (Microfrontend del Carrito)

Gestiona exclusivamente el carrito de un usuario autenticado.

### Tareas (Cart App):
- [x] Inicializar el microfrontend `cart-app`.
- [x] Proteger rutas para requerir autenticación (`ProtectedRoute` del Shell).
- [x] **Contexto del Carrito / Mini Cart**:
  - [x] Integrar `GET /cart`.
  - [x] Mini Cart en el header: badge con el total real (Cart App emite `CART_UPDATED`).
- [x] **Página del Carrito (`/cart`)**:
  - [x] Listado de ítems `CartItem` con totalización (nombres completados con `GET /products/{id}`, ver backlog §12).
  - [x] Integrar adición: `POST /cart/items`, escuchando `CART_ADD_ITEM` desde cualquier página con `cartApp/CartSync`.
  - [x] Integrar modificación: `PUT /cart/items/{productId}`.
  - [x] Integrar eliminación individual `DELETE /cart/items/{productId}`.
  - [x] Integrar vaciado global `DELETE /cart`.
- [x] Botón de CTA "Proceder al Checkout": navega a `/orders/checkout` (la página es parte de la Fase 5).

---

## 📦 Fase 5: Orders & Payments App (Microfrontend de Pedidos y Pago)

Maneja el Checkout a partir del carrito y la visualización de órdenes pasadas.

### Tareas (Orders App):
- [x] Inicializar el microfrontend `orders-app` (expuesto en `/orders/*`, protegido por `ProtectedRoute` en el shell).
- [x] **Flujo de Creación de Pedido (Checkout, `/orders/checkout`)**:
  - Resumen del carrito (`GET /cart`) y formulario para la dirección de envío (`address`).
  - `POST /orders` crea el pedido; el id llega en la cabecera `Location`. El backend vacía el carrito y el
    badge pasa a 0 (`CART_UPDATED`).
- [x] **Flujo de Pago (Simulación, `/orders/:id/pay`)**:
  - `POST /payments/process` con `orderId`, `amount` (= total del pedido) y `simulateResult`.
    `APPROVED` → `PAID`; `REJECTED` → sigue `CREATED` y se puede reintentar.
- [x] **Historial de Pedidos (`/orders`)**:
  - `GET /orders`, ordenado del más reciente al más antiguo.
- [x] **Detalle de Pedido (`/orders/:id`)**:
  - `GET /orders/{id}` con ítems, estado y total. Si está `CREATED`: pagar o cancelar (`POST /orders/{id}/cancel`).

> Verificado en el navegador contra un mock local con el comportamiento del backend. **Falta probarlo contra
> el backend real**: su CORS no admite todavía el origen del shell (`http://localhost:5000`). Ver backlog §12.

---

## ⚙️ Fase 6: Admin App (Microfrontend de Administración)

Panel de control para operaciones del negocio. Acceso protegido y validado en Frontend (el backend sigue siendo la autoridad).

### Tareas (Admin App):
- [x] Inicializar el microfrontend `admin-app` (expuesto en `/admin/*`).
- [x] Layout (menú lateral + Resumen) y **guardián de ruta** (`ProtectedRoute` del shell con `ADMIN`/`SUPER_ADMIN`).
- [x] **Gestión de Catálogo (Req. `ADMIN`)**:
  - Categorías: crear, renombrar y eliminar (borrado lógico; bloqueado si tiene productos activos).
  - Productos: crear, editar, desactivar y reactivar, con validación previa (precio > 0, stock ≥ 0).
- [x] **Visualización Global de Pedidos (Req. `ADMIN`)**:
  - `GET /orders` global con filtro por estado, email del cliente y cancelación de pedidos pendientes.
- [x] **Gestión de Usuarios**:
  - Listado (`GET /admin/users`) para `ADMIN` y `SUPER_ADMIN`.
  - Cambio de rol `CLIENT` ↔ `ADMIN` (`POST /admin/users/{id}/role`), solo `SUPER_ADMIN`.

> Se usaron las rutas y formas del **código** del backend, que difieren de `auth.yaml` y `catalog.yaml`
> (backlog §12). Verificado contra un mock; falta probar con el backend real.

---

## 🧪 Fase 7: Calidad y Testing (Transversal)

- [x] Configuración de ESLint compartida para las 6 apps (`eslint.config.js` en la raíz).
- [ ] Implementar un `httpClient` compartido (wrapper de `fetch`) en el *UI Kit* o *Shell* para controlar 401, 403, 404 y vaciar sesión.
- [ ] Testing Unitario y de Integración con Vitest y React Testing Library para casos críticos (validaciones de formularios, hooks, `eventBus`, guards).
- [ ] Testing End-to-End con Playwright (recomendado por el soporte multi-origen) o Cypress, recorriendo el User Journey (Registro → Login → Catálogo → Carrito → Checkout).

---

## ☁️ Fase 8: Despliegue en Vercel y CI/CD

El destino de despliegue del MVP es **Vercel** (reemplaza la opción anterior de Dockerfiles + NGINX).
Cada microfrontend se despliega como un proyecto Vercel independiente apuntando al mismo repositorio,
con su propio *Root Directory*, para que cada remoto sirva su `remoteEntry.js` desde una URL estable.

### Tareas (Despliegue):
- [x] Parametrizar las URLs de los remotes con variables `VITE_*_REMOTE_URL` (ver `.env.example`).
- [ ] Crear 6 proyectos en Vercel (`shell`, `auth-app`, `catalog-app`, `cart-app`, `orders-app`, `admin-app`) y fijar sus dominios.
- [ ] Añadir `vercel.json` por app con:
  - rewrite SPA `/(.*)` → `/index.html` (todas usan `BrowserRouter`),
  - cabeceras CORS para `/assets/*` (el Shell importa `remoteEntry.js` desde otros orígenes).
- [ ] Configurar variables de entorno por proyecto: `VITE_*_REMOTE_URL` (dominios Vercel) y `VITE_*_API_URL` (backend desplegado).
- [ ] Documentar el orden de despliegue: remotos primero, Shell al final. Las URLs de los remotes se resuelven en **build time**, así que cambiar un dominio exige recompilar a quien lo consume.
- [ ] CI con GitHub Actions: `lint`, `test` y `build` vía Turborepo en cada PR a `develop`/`main`.
- [ ] Validar el flujo completo en Preview Deployments antes de promover a producción.

> **Dependencia externa:** el backend debe estar desplegado con HTTPS (Vercel sirve en HTTPS y el navegador
> bloquea contenido mixto) y con CORS habilitado para los dominios del frontend. El despliegue del backend
> queda fuera de este repositorio.
