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
| 1 | Shell | 🟡 Parcial | Router, MF y bus de eventos listos. Falta sesión en el header, rutas protegidas, 404 y UI Kit. |
| 2 | Auth App | 🟢 Completa | Login, registro, JWT y `useAuthSession` expuestos. |
| 3 | Catalog App | 🟢 Completa | Listado, filtro por categoría y detalle conectados a la API. |
| 4 | Cart App | 🟡 Parcial | UI lista pero 100% mockeada; no escucha `CART_ADD_ITEM`. |
| 5 | Orders App | 🔴 Pendiente | Solo placeholder. |
| 6 | Admin App | 🔴 Pendiente | Solo placeholder. |
| 7 | Calidad y testing | 🔴 Pendiente | Sin tests, sin interceptor de errores. |
| 8 | Despliegue Vercel + CI/CD | 🔴 Pendiente | Remotes ya parametrizados por entorno; falta todo lo demás. |

---

## 🏗️ Fase 1: Fundaciones y Arquitectura Base (Shell App)

El **Shell App** es la aplicación anfitriona que orquesta la carga de todos los microfrontends, gestiona el enrutamiento principal y los estados globales transversales (como la sesión del usuario).

### Tareas (Shell):
- [x] Inicializar el monorepo con Turborepo + npm workspaces.
- [x] Configurar el **Shell App** con React y Vite (Module Federation).
- [x] Parametrizar las URLs de los remotes por entorno (`loadEnv` + `.env` en la raíz, ver `.env.example`).
- [~] Definir e implementar el sistema de enrutamiento principal (`react-router-dom`).
  - Hecho: rutas `/login`, `/register`, `/cart`, `/orders/*`, `/admin/*` y catálogo en `/`.
  - Falta: página 404 (hoy cualquier ruta desconocida cae en `CatalogApp`), `ErrorBoundary` si un remoto no carga, `/cart` → `/cart/*`.
- [ ] **UI Kit Compartido (Shared Library):** Crear un paquete interno o design system con Tailwind CSS para componentes comunes (Botones, Inputs, Modales, Tablas, Headers) y un preset de Tailwind común.
- [x] Implementar un bus de eventos (`CustomEvents`) para comunicar remotos (`shell/src/core/events/eventBus.js`, expuesto como `shellApp/eventBus`).
- [~] Integrar un Header global en el Shell con la navegación principal, acceso a login/perfil y el "Mini Cart".
  - Hecho: navbar global con badge del carrito (`useCartBadge`).
  - Falta: mostrar login vs. avatar/logout según sesión, enlace a `/admin` por rol, buscador funcional, rutas reales de `Categories`/`About Us`.
- [ ] Rutas protegidas (`ProtectedRoute`) para `/cart`, `/orders/*` y `/admin/*`, con redirección a `/login` y retorno a la página de origen.

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
- [ ] Redirección post-login a la página de origen (`?redirect=` o `state.from`); hoy siempre vuelve a `/`.
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
  - [x] Integrar `GET /products` (con soporte para filtrar por `categoryId` y `active`).
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
- [~] Proteger rutas para requerir autenticación: existe un guard propio en `CartPage`; debe reemplazarse por el `ProtectedRoute` del Shell.
- [~] **Contexto del Carrito / Mini Cart**:
  - [ ] Integrar `GET /cart` (hoy `cartService.js` devuelve datos mock).
  - [~] Mini Cart en el header: el badge existe en el Shell, pero cuenta eventos locales, no el total real del backend.
- [~] **Página del Carrito (`/cart`)**:
  - [x] Listado de ítems `CartItem` con totalización (sobre datos mock).
  - [ ] Integrar adición: `POST /cart/items`, escuchando el evento `CART_ADD_ITEM` que emite Catalog App (**hoy nadie lo escucha**).
  - [~] Integrar modificación: `PUT /cart/items/{productId}` (UI lista, servicio mock).
  - [ ] Integrar eliminación individual `DELETE /cart/items/{productId}` (falta el botón en la UI) y vaciado global `DELETE /cart`.
- [~] Botón de CTA "Proceder al Checkout": existe en la UI pero no navega a Orders App.

---

## 📦 Fase 5: Orders & Payments App (Microfrontend de Pedidos y Pago)

Maneja el Checkout a partir del carrito y la visualización de órdenes pasadas.

### Tareas (Orders App):
- [~] Inicializar el microfrontend `orders-app` (expuesto en `/orders/*`; hoy es un placeholder sin rutas protegidas).
- [ ] **Flujo de Creación de Pedido (Checkout)**:
  - Formulario para recoger la dirección de envío (`address`).
  - Integrar `POST /orders` para confirmar la intención de compra.
- [ ] **Flujo de Pago (Simulación)**:
  - Pantalla para confirmar el pago del pedido recién creado.
  - Integrar `POST /payments/process` pasándole el `orderId` y `amount` (pasa la orden a `PAID` si es `APPROVED`).
- [ ] **Historial de Pedidos (`/orders`)**:
  - Integrar `GET /orders` para ver las compras del usuario autenticado.
- [ ] **Detalle de Pedido (`/orders/{id}`)**:
  - Integrar `GET /orders/{id}` para mostrar ítems, estados (`CREATED`, `PAID`, `CANCELLED`) y totales.

> ⚠️ Bloqueado parcialmente por contratos: `POST /orders` no documenta cuerpo de respuesta (falta `orderId`)
> y no existe endpoint de cancelación. Ver backlog §12.

---

## ⚙️ Fase 6: Admin App (Microfrontend de Administración)

Panel de control para operaciones del negocio. Acceso protegido y validado en Frontend (el backend sigue siendo la autoridad).

### Tareas (Admin App):
- [~] Inicializar el microfrontend `admin-app` (expuesto en `/admin/*`; hoy es un placeholder).
- [ ] Crear Layout (SideMenu, Dashboard) y **Guardianes de Ruta** (Validar rol `ADMIN` o `SUPER_ADMIN`).
- [ ] **Gestión de Catálogo (Req. `ADMIN`)**:
  - CRUD de Categorías: `POST /categories`, `PUT /categories/{id}`, `DELETE /categories/{id}`.
  - CRUD de Productos: `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}`.
- [ ] **Visualización Global de Pedidos (Req. `ADMIN`)**:
  - Tabla conectada a `GET /orders` global.
- [ ] **Gestión de Usuarios**:
  - Vista de usuarios listada de `GET /users`.
  - Crear usuarios administrativos con `POST /users`.
  - Cambiar roles con `PUT /users/{id}/role` (solo `SUPER_ADMIN`).

> ⚠️ Pendiente de decisión: la regla 6.2 de `docs/busines-rules.md` permite a `ADMIN` **listar** usuarios,
> mientras que este roadmap restringía toda la sección a `SUPER_ADMIN`. Ver backlog §12.

---

## 🧪 Fase 7: Calidad y Testing (Transversal)

- [ ] Configuración de ESLint en los 5 remotos (hoy solo existe en `shell`, `npm run lint` falla).
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
