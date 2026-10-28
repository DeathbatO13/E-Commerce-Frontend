# Backlog Técnico — E-commerce Frontend MVP

> Auditoría del estado actual del repositorio y checklist granular para completar el proyecto,
> cubrir testing y dejarlo listo para desplegar en Vercel con CI/CD.
>
> Generado a partir de: [`ReadMe.md`](../ReadMe.md), [`Roadmap-Microfrontends.md`](../Roadmap-Microfrontends.md),
> [`docs/architecture/ReadMe.md`](./architecture/ReadMe.md), [`docs/busines-rules.md`](./busines-rules.md) y los
> OpenAPI de `docs/openapi/`.
>
> El [Roadmap](../Roadmap-Microfrontends.md) define *qué* se entrega por fase; este backlog es el desglose
> técnico. Última sincronización con el código: 2026-10-28.

## Diagnóstico rápido

| App | Estado real |
|---|---|
| **Build** | `turbo run build` compila las 6 apps (corregido en PR #12: `loadEnv` en `vite.config.js`, `lazy`/`Suspense` desde `react`, `packageManager` en la raíz). |
| **Shell** | Routing + eventBus + navbar funcionales. Sin manejo de sesión/roles global, sin 404 ni `ErrorBoundary`. |
| **Auth** | Login/Register + JWT decode completos y bien hechos. |
| **Catalog** | Listado, filtro por categoría y detalle conectados a la API real. Paginación y rango de precio son solo visuales. |
| **Cart** | UI completa pero **100% mockeada** (`cartService.js` con `setTimeout`), no conectada al backend real ni al `eventBus`. |
| **Orders** | **Solo un placeholder decorativo**, cero lógica. |
| **Admin** | **Solo un placeholder decorativo**, cero lógica. |
| **Testing** | **Inexistente** — ni Vitest/Jest ni Testing Library ni Playwright/Cypress en ningún `package.json`. |
| **CI/CD** | No existe carpeta `.github/`. |
| **Vercel** | Remotes ya parametrizados por entorno; no existe `vercel.json` ni proyectos creados. Vercel es el **único** destino de despliegue (se descartó Docker + NGINX). |
| **Lint** | Solo `shell/eslint.config.js` existe; los otros 5 apps tienen `"lint": "eslint ."` pero **sin config propia** → falla al ejecutarse. |

---

## 1. Arquitectura de Module Federation (bloqueante para producción)

Las URLs de los remotes se leen con `loadEnv` desde el `.env` de la raíz (`envDir` apunta a la raíz del
monorepo en los 6 `vite.config.js`), con fallback a `http://localhost:500X`.

- [x] Parametrizar todas las URLs de `remotes` vía `VITE_*_REMOTE_URL` con fallback a localhost.
      Nota: en `vite.config.js` no existe `import.meta.env` (corre en Node); se usa `loadEnv(mode, ROOT_DIR)`.
- [x] Decidir estrategia de despliegue en Vercel: **6 proyectos Vercel separados** (uno por app, cada uno
      con su propio dominio `*.vercel.app`) — es el único enfoque viable con `vite-plugin-federation`, ya
      que cada remoto necesita servir su `remoteEntry.js` desde una URL estable en runtime.
- [~] `.env.example` centralizado en la raíz (hecho). Falta cargar las URLs finales como variables de
      entorno en cada proyecto Vercel (ver §10).
- [ ] Añadir cabeceras CORS (`Access-Control-Allow-Origin: *` o dominio del shell) a los `remoteEntry.js` y
      assets — en Vercel esto se resuelve con un `vercel.json` con `headers` por app.
- [ ] Verificar `build.target: 'esnext'` en todos los `vite.config.js` — confirmar compatibilidad con el
      runtime de Vercel y navegadores objetivo (federation dinámico requiere `import()` nativo).
- [ ] Resolver orden de build: las URLs de los remotes quedan fijadas en **build time** en el bundle de quien
      las consume (`shell`, `catalog-app`, `cart-app`), así que esas URLs deben conocerse antes de compilar —
      documentar el orden de despliegue (remotos primero, shell al final) o usar dominios reservados de
      antemano.
- [ ] Revisar consistencia de `shared: ['react', 'react-dom', 'react-router-dom']` — confirmar mismas
      versiones exactas en los 6 `package.json` (el lockfile duplicado de `shell/` ya se eliminó).
- [ ] Romper la dependencia circular `shell` ↔ `catalog-app` (el shell consume `catalogApp` y catalog consume
      `shellApp/eventBus`). Además, en `npm run dev:all` el shell corre con `vite` en modo dev, que no genera
      `remoteEntry.js`, por lo que `shellApp/eventBus` no está disponible para catalog. Opciones: mover el
      `eventBus` a un paquete de workspace, o usar `dev:mf` para el shell.
- [ ] Añadir manejo de error cuando un remoto no carga (`remoteEntry.js` caído/timeout) en el
      `AppRouter.jsx` del shell — hoy un fallo de red revienta el `Suspense` sin fallback de error (falta
      un `ErrorBoundary`).

---

## 2. Shell App

- [ ] Implementar **estado global de sesión** en el shell (hoy `TopNavBar.jsx` no sabe si hay usuario
      logueado — muestra siempre el mismo avatar hardcodeado). Consumir `authApp/useAuth`
      (`useAuthSession`) desde el shell.
- [ ] Mostrar condicionalmente en el navbar: botón "Iniciar sesión" vs. avatar + menú de usuario + "Cerrar
      sesión", según sesión activa.
- [ ] Mostrar enlace a `/admin` en el navbar solo si `role` es `ADMIN` o `SUPER_ADMIN`.
- [ ] Implementar **rutas protegidas** reales (`ProtectedRoute` / `RequireAuth` wrapper) en
      `AppRouter.jsx` para `/cart`, `/orders/*`, `/admin/*`, en lugar de dejar que cada microfrontend
      redirija por su cuenta (hoy solo `cart-app` lo hace, ver punto 4).
- [ ] Añadir un `ErrorBoundary` global alrededor de `<Suspense>` en `shell/src/app/routes/AppRouter.jsx`
      para capturar fallos de carga de remotos.
- [ ] Implementar página **404** para rutas no reconocidas (hoy `path="/*"` cae siempre en `CatalogApp`).
- [ ] Limpiar código muerto: `shell/src/App.jsx` no se usa (el `main.jsx` monta `AppRouter` directamente) —
      eliminarlo o documentarlo.
- [ ] Implementar buscador del navbar (input `search-input` es decorativo, sin `onChange`/navegación).
- [ ] Completar enlaces `Categories` / `About Us` del navbar, hoy son placeholders sin ruta real.
- [ ] Interceptor global de errores HTTP (401/403/404) — mencionado en el roadmap (Fase 7) y aún no
      implementado: crear un wrapper `fetch` compartido (ver punto 7) que en 401 dispare `logout()` + emita
      `AUTH_SESSION_CHANGE` + redirija a `/login`.

---

## 3. Auth App

- [ ] Verificar feedback de validación en tiempo real en `LoginPage.jsx`/`RegisterPage.jsx` (confirmar que
      cubren: email inválido, password corta, confirmación de password en registro).
- [ ] Manejar y mostrar errores específicos del backend (usuario ya existe, credenciales inválidas) de
      forma consistente con el `Alert.jsx` ya creado.
- [ ] Añadir **expiración proactiva de sesión**: hoy `isTokenExpired` solo se verifica reactivamente al
      leer sesión (`auth-app/src/services/authService.js`); falta expulsar al usuario automáticamente
      cuando el token expira mientras navega (con un `setTimeout` basado en `exp`, o interceptor 401).
- [ ] Redirección post-login: confirmar que respeta un `?redirect=` o `state.from` para volver a la página
      que motivó el login (ej. usuario intenta agregar al carrito sin sesión).
- [ ] Test de decodificación de JWT malformado / sin `role` — cubrir edge cases del `decodeToken`.

---

## 4. Cart App — brecha crítica

Actualmente es solo maqueta visual. Hay que conectarlo de punta a punta:

- [ ] **Reemplazar `cartService.js` mockeado por integración real** contra `docs/openapi/cart.yaml`
      (`GET /cart`, `POST /cart/items`, `PUT /cart/items/{productId}`, `DELETE /cart/items/{productId}`,
      `DELETE /cart`), siguiendo el mismo patrón `fetch` + `parseResponse` que ya usa `catalog-app`.
- [ ] Añadir header `Authorization: Bearer <token>` en todas las llamadas (usando
      `authApp/authService.getToken()`), ya que el carrito requiere sesión.
- [ ] **Suscribir `cart-app` al evento `CART_ADD_ITEM`** del `eventBus` — hoy `catalog-app` emite el evento
      (`catalog-app/src/pages/ProductDetailPage.jsx`) y el shell solo lo usa para el badge visual
      (`shell/src/core/events/useCartBadge.js`); **`cart-app` nunca escucha ese evento**, por lo que agregar
      un producto desde el catálogo nunca llega a `POST /cart/items`. Este es el bug de integración más
      importante del proyecto.
- [ ] Declarar `shellApp` como remote en `cart-app/vite.config.js` (hoy solo declara `authApp`) para poder
      importar `shellApp/eventBus`.
- [ ] Sustituir el guard de sesión ad-hoc en `CartPage.jsx` por el `ProtectedRoute` compartido del shell
      (punto 2).
- [ ] Implementar botón "Vaciar carrito" (`DELETE /cart`) — existe en el roadmap y en el OpenAPI pero no en
      la UI.
- [ ] Implementar el CTA "Proceder al Checkout" que navegue a `orders-app` pasando el carrito activo.
- [ ] Reemplazar imágenes `via.placeholder.com` por manejo real de `image` del producto (o un placeholder
      local, ya que `placeholder.com` es un servicio externo poco confiable para producción).
- [ ] Sincronizar el contador del navbar (`useCartBadge`) con el `total` real devuelto por `GET /cart` al
      montar el shell, no solo con eventos incrementales — hoy si el usuario recarga la página el contador
      viene de `localStorage`, que puede desincronizarse del backend.

---

## 5. Orders App — no implementado (Fase 5 completa)

Hoy `orders-app/src/OrdersApp.jsx` es 100% decorativo. Replicar la arquitectura limpia ya usada en
`catalog-app`/`cart-app` (`pages/`, `hooks/`, `services/`, `components/`):

- [ ] `services/ordersService.js` contra `docs/openapi/order.yaml`: `POST /orders`, `GET /orders`,
      `GET /orders/{id}`.
- [ ] `services/paymentService.js` contra `docs/openapi/payment.yaml`: `POST /payments/process`.
- [ ] Página **Checkout** (`/orders/checkout` o similar): formulario de dirección de envío + confirmación,
      crea el pedido desde el carrito activo (`POST /orders`).
- [ ] Página **Pago simulado**: pantalla post-creación de pedido que llama `POST /payments/process` con
      `orderId`/`amount`, y refleja resultado aprobado/rechazado (regla de negocio 5.1/5.2 de
      `docs/busines-rules.md`).
- [ ] Página **Historial de pedidos** (`/orders`): `GET /orders`, tabla/lista con estado
      (`CREATED`/`PAID`/`CANCELLED`) y fecha.
- [ ] Página **Detalle de pedido** (`/orders/{id}`): items, totales, estado, y botón "Cancelar pedido"
      habilitado solo si `status === 'CREATED'` (regla 4.3).
- [ ] Definir subrutas internas con `<Routes>` dentro de `OrdersApp.jsx` (ya está expuesto como
      `/orders/*` en el shell).
- [ ] Proteger todas las rutas con sesión activa (mismo patrón que cart-app debería usar).
- [ ] Vaciar/resetear el badge del carrito (`useCartBadge().reset()`) tras crear el pedido exitosamente.
- [ ] Declarar `authApp` (y `shellApp` si aplica) como remotes en `orders-app/vite.config.js` (hoy no tiene
      ningún remote declarado).

---

## 6. Admin App — no implementado (Fase 6 completa)

Hoy `admin-app/src/AdminApp.jsx` es 100% decorativo.

- [ ] Layout admin: `SideMenu` + `Dashboard` propio del microfrontend.
- [ ] **Guard de rol** (`ADMIN`/`SUPER_ADMIN`) usando `authApp/useAuth` — redirigir a `/` (o 403) si el rol
      no alcanza. Esta es una validación de UI únicamente (regla 7: "el frontend no sustituye las
      validaciones de backend"), pero es requisito del roadmap.
- [ ] CRUD de Categorías: listado, crear, editar, eliminar (`docs/openapi/catalog.yaml` →
      `POST/PUT/DELETE /categories/{id}`).
- [ ] CRUD de Productos: listado, crear, editar, eliminar (`POST/PUT/DELETE /products/{id}`).
- [ ] Vista global de pedidos (`GET /orders` sin filtro de usuario, visible solo para ADMIN/SUPER_ADMIN —
      regla 6.1).
- [ ] Gestión de usuarios (**solo SUPER_ADMIN**, regla 1.3/6.2): listado `GET /users`, alta `POST /users`,
      cambio de rol `PUT /users/{id}/role`. Ocultar esta sección completa si `role !== 'SUPER_ADMIN'`,
      incluso para ADMIN.
- [ ] Declarar `authApp` como remote en `admin-app/vite.config.js`.
- [ ] Formularios con validación (precio > 0, campos requeridos, etc.) antes de llamar a la API.

---

## 7. UI Kit compartido / Arquitectura limpia transversal

El roadmap ya lo marca como pendiente (Fase 1) y hoy cada app repite botones/inputs/alerts propios
(`auth-app/src/components/ui/*`) sin reutilización entre remotos.

- [ ] Decidir mecanismo de compartición: exponer componentes UI comunes vía Module Federation desde el
      `shell` (ya expone `TopNavBar`/`Footer`/`eventBus`, se puede ampliar con `Button`, `Input`, `Modal`,
      `Table`) **o** crear un paquete interno de workspace (`packages/ui-kit`) consumido en build-time.
      Para MF, lo más simple y ya alineado con el patrón existente es ampliar los `exposes` del shell.
- [ ] Migrar componentes duplicados (`Button.jsx`, `Alert.jsx`, `Input.jsx` de auth-app) al UI Kit
      compartido y reusarlos en cart/orders/admin en vez de recrearlos.
- [ ] Definir tokens de diseño (colores, espaciados) centralizados en Tailwind config compartida — hoy
      cada app tiene su propio `tailwind.config.js` sin extends de un preset común.
- [ ] Servicio `httpClient.js` compartido (fetch wrapper con base URL, headers de auth automáticos, manejo
      uniforme de errores 401/403/404/5xx) — reemplazaría la lógica repetida de `parseResponse` en cada
      `*Service.js`. Este es el punto explícito de la Fase 7 del roadmap.

---

## 8. Testing (hoy: 0% de cobertura, sin infraestructura)

Ningún `package.json` tiene Vitest, Jest, Testing Library, Cypress o Playwright.

### Setup
- [ ] Instalar y configurar **Vitest + @testing-library/react + @testing-library/jest-dom + jsdom** en cada
      uno de los 6 workspaces (o centralizado con `vitest.workspace.ts` en la raíz, más idiomático dado que
      ya usan Turborepo).
- [ ] Añadir script `"test": "vitest run"` y `"test:watch": "vitest"` a cada `package.json` y a
      `turbo.json` (`tasks.test`).
- [ ] Configurar mocks de Module Federation para tests (los `import 'authApp/authService'` fallan fuera del
      runtime de MF) — usar alias de Vitest (`resolve.alias`) apuntando a mocks locales por app.

### Unitarios / integración (prioridad según roadmap Fase 7 y reglas de negocio)
- [ ] `authService.js`: `decodeToken`, `isTokenExpired`, `getSession`, `getRole` — casos válidos, token
      ausente, token corrupto, token expirado.
- [ ] `useLogin`/`useRegister`: éxito, error de API, estado `loading`.
- [ ] Validaciones de formularios `LoginPage`/`RegisterPage`.
- [ ] `useCatalog`/`useProductDetail`: fetch éxito, error, filtro por categoría.
- [ ] `useCart` (tras conectarlo al backend real): actualización optimista, rollback en error.
- [ ] `eventBus`: `emit`/`on`/`off` — verificar que el cleanup remueve listeners.
- [ ] `useCartBadge`: incremento por evento, persistencia en `localStorage`, `reset()`.
- [ ] Reglas de negocio críticas en frontend (validables sin backend): botón "Agregar al carrito"
      deshabilitado si `product.active === false`; botón "Cancelar pedido" visible solo si
      `status === 'CREATED'`; sección de usuarios visible solo si `role === 'SUPER_ADMIN'`.
- [ ] Guards de ruta protegida (redirige a `/login` sin sesión, permite paso con sesión).

### E2E (Fase 7 del roadmap)
- [ ] Elegir Playwright (recomendado sobre Cypress por mejor soporte multi-tab/multi-origin, relevante
      porque cada microfrontend corre en su propio puerto/dominio) o Cypress.
- [ ] Journey completo: Registro → Login → ver catálogo → filtrar por categoría → ver detalle → agregar al
      carrito → editar cantidad → checkout → pago simulado (aprobado) → ver en historial de pedidos.
- [ ] Journey admin: login como ADMIN → crear categoría → crear producto → verlo en catálogo público →
      editarlo → eliminarlo.
- [ ] Journey de permisos: usuario CLIENT no puede acceder a `/admin` (redirect); ADMIN no ve la sección de
      usuarios (solo SUPER_ADMIN).
- [ ] Correr E2E contra `npm run preview` de todas las apps orquestadas (Turborepo `preview` task ya
      existe), no contra `dev`.

---

## 9. CI/CD con GitHub Actions

No existe `.github/workflows/`.

- [ ] `.github/workflows/ci.yml` — en cada push/PR a `develop` y `main`:
  - [ ] Job `lint`: `turbo run lint` (requiere primero resolver el punto 11 — configs de ESLint faltantes).
  - [ ] Job `test`: `turbo run test` con cobertura, usando cache de Turborepo (`actions/cache` sobre
        `.turbo/`).
  - [ ] Job `build`: `turbo run build`, matriz por app o build único, verificando que los 6 `dist/` se
        generan sin error.
  - [ ] Subir reporte de cobertura (ej. como artifact o a Codecov si se quiere).
- [ ] `.github/workflows/e2e.yml` (puede ir separado por ser más lento): levanta todas las apps en modo
      `preview` (concurrently, reusando `dev:all`/`preview` ya definidos en el `package.json` raíz) y corre
      Playwright/Cypress contra ellas.
- [ ] `.github/workflows/deploy.yml` — al hacer merge a `main`:
  - [ ] Trigger de despliegue a Vercel por cada uno de los 6 proyectos (vía `vercel deploy --prod` con
        `VERCEL_TOKEN`/`VERCEL_ORG_ID`/`VERCEL_PROJECT_ID_*` como secrets de GitHub, uno por app) **o**
        delegarlo directamente a la integración nativa Git de Vercel (más simple: cada proyecto Vercel
        apuntando a la misma repo con distinto "Root Directory") — decidir cuál según preferencia.
  - [ ] Orden de despliegue: remotos (`auth`, `catalog`, `cart`, `orders`, `admin`) antes que `shell`, o
        bien dominios custom fijos por app para evitar dependencia de orden.
- [ ] Configurar branch protection en `develop`/`main` exigiendo el workflow de CI en verde antes de merge
      (esto es configuración de GitHub, no de código — se activa manualmente en Settings → Branches).
- [ ] Cachear `node_modules`/`~/.npm` por workspace en Actions (`actions/setup-node` con `cache: npm` sobre
      el `package-lock.json` raíz) para acelerar el pipeline.

---

## 10. Despliegue en Vercel

> Vercel es el único destino de despliegue del MVP (en el alcance desde 2026-10-28; reemplaza a la
> opción Dockerfiles + NGINX del roadmap original).

- [ ] Crear `vercel.json` en cada una de las 6 apps con: `buildCommand`, `outputDirectory: "dist"`, y
      `headers` con CORS habilitado para `/assets/(.*)` — no solo `remoteEntry.js`: el shell también
      descarga los chunks `__federation_*` del remoto desde otro origen `*.vercel.app`.
- [ ] Crear 6 proyectos en Vercel, cada uno con **Root Directory** apuntando a `shell/`, `auth-app/`,
      `catalog-app/`, `cart-app/`, `orders-app/`, `admin-app/` respectivamente (mismo monorepo, distinto
      root — soportado nativamente por Vercel). Verificar que la instalación se ejecute desde la raíz del
      monorepo (npm workspaces + un único `package-lock.json`).
- [ ] Configurar variables de entorno por proyecto en el dashboard de Vercel (`loadEnv` también lee las
      variables `VITE_*` del entorno del proceso, así que no hace falta un `.env` en Vercel): `VITE_AUTH_API_URL`,
      `VITE_CATALOG_API_URL`, `VITE_CART_API_URL`, `VITE_ORDER_API_URL`, `VITE_PAYMENT_API_URL` (apuntando
      al backend real desplegado, fuera del alcance de este repo) + `VITE_*_REMOTE_URL` (del punto 1)
      apuntando a los dominios `*.vercel.app` de cada microfrontend ya desplegado.
- [ ] Fijar dominios estables (Vercel asigna uno por proyecto automáticamente, ej.
      `ecommerce-shell.vercel.app`) antes de configurar los `remotes` del shell, para evitar el problema de
      dependencia circular de URLs.
- [ ] Verificar rewrites/SPA fallback: cada app usa `react-router-dom` con `BrowserRouter`, así que cada
      `vercel.json` necesita un rewrite `"/(.*)" → "/index.html"` para que las rutas internas no den 404 al
      refrescar.
- [ ] Probar el flujo completo en Preview Deployments de Vercel antes de promocionar a producción (Vercel
      genera preview URLs por PR — validar que el shell de preview puede seguir resolviendo los remotos de
      producción o generar previews coordinados).
- [ ] Dependencia externa (fuera de este repo): el backend debe estar desplegado con **HTTPS** (el navegador
      bloquea llamadas `http://` desde una página `https://*.vercel.app`) y con **CORS** habilitado para los
      dominios del frontend.

---

## 11. Higiene de código y DX (transversal, hacer primero)

- [ ] Crear `eslint.config.js` en `auth-app`, `catalog-app`, `cart-app`, `orders-app`, `admin-app` (hoy
      `"lint": "eslint ."` falla en los 5 porque no hay config — solo existe en `shell/eslint.config.js`).
      Idealmente centralizar en un config compartido en la raíz e importarlo desde cada app.
- [x] Resolver `package-lock.json` duplicado: se eliminó `shell/package-lock.json`; solo queda el de la
      raíz (npm workspaces). Reinstalar desde la raíz para limpiar `shell/node_modules`.
- [x] `.env.example` centralizado en la raíz (en lugar de uno por app): los 6 `vite.config.js` usan
      `envDir` apuntando a la raíz del monorepo.
- [x] Añadir `packageManager` en el `package.json` raíz (Turborepo 2 lo exige para resolver workspaces).
- [ ] Añadir `engines` en el `package.json` raíz (`"node": ">=18"`) ya mencionado en el README pero no
      forzado.
- [ ] Evaluar `prettier` + `husky`/`lint-staged` para consistencia de formato antes de CI (opcional pero
      recomendable dado el volumen de apps).
- [ ] Considerar TypeScript incremental (al menos para `services/` y `hooks/`, que son la lógica más
      crítica) — el proyecto es 100% JS/JSX hoy; no es bloqueante pero mejora fuertemente la robustez en un
      monorepo de microfrontends donde los contratos entre remotos (`exposes`/`remotes`) son fáciles de
      romper silenciosamente.
- [ ] Unificar los `tailwind.config.js`: hoy `catalog-app` y `cart-app` tienen el mismo tema copiado y el
      shell el suyo. Extraer un preset compartido (relacionado con §7).

---

## 12. Contratos de API y decisiones pendientes

Huecos en `docs/openapi/` y en las reglas de negocio que bloquean o condicionan el frontend. Los contratos
son propiedad del backend: se deben acordar allí y luego reflejar aquí.

- [ ] `POST /orders` (`order.yaml`) responde `201` **sin cuerpo**: el frontend no recibe el `orderId` que
      necesita para `POST /payments/process`. Documentar que devuelve `OrderResponse`.
- [ ] No existe endpoint para **cancelar pedidos**, aunque la regla 4.3 lo contempla y el detalle de pedido
      lo necesita (ej. `POST /orders/{id}/cancel`).
- [ ] `CartItem` (`cart.yaml`) solo tiene `productId`, `quantity` y `price`; la UI del carrito muestra nombre
      e imagen. Decidir si el Cart Service enriquece la respuesta o si el frontend consulta el catálogo.
- [ ] `ProductResponse` no tiene campo de imagen y `GET /products` no soporta paginación, pero la UI muestra
      ambas cosas.
- [ ] Los claims del JWT (`role`, `exp`, `sub`) no están documentados en `auth.yaml`, y el frontend depende
      de `role` y `exp`.
- [ ] **Decisión de negocio:** la regla 6.2 permite a `ADMIN` listar usuarios, pero el roadmap restringía toda
      la gestión de usuarios a `SUPER_ADMIN`. Definir cuál aplica en Admin App.
- [ ] El campo `active` del producto significa "habilitado" (regla 3.2), pero la UI lo muestra como
      "In Stock". Ajustar el texto o agregar stock al contrato.

---

## Orden de trabajo sugerido

1. **Higiene base** (§11) — lockfile y `.env` ya resueltos; falta la configuración de ESLint.
2. **Cerrar el flujo de compra** (§4, §5) — conectar `cart-app` de verdad y construir `orders-app`, porque
   hoy el user journey principal (catálogo → carrito → checkout) está roto en el medio.
3. **Admin App** (§6) — desbloquea el segundo actor del sistema.
4. **UI Kit + manejo de sesión en shell** (§2, §7) — antes de testing, para no testear componentes que se
   van a refactorizar.
5. **Testing** (§8) — unitario primero, E2E al final una vez el journey esté estable.
6. **CI/CD + Vercel** (§1, §9, §10) — en paralelo con testing, pero el `vercel.json`/variables de entorno
   solo tienen sentido una vez las apps funcionan end-to-end localmente.

Los puntos de §12 conviene acordarlos con backend **antes** de empezar Orders App (§5).
