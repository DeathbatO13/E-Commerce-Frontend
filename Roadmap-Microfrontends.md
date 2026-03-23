# 🚀 Hoja de Ruta: E-commerce MVP - Microfrontends

Basado en la arquitectura hexagonal del backend, el sistema de Microfrontends (usando Module Federation o similar), las reglas de negocio y las especificaciones de OpenAPI, esta es la hoja de ruta y el desglose de tareas paso a paso para liderar y completar el desarrollo frontend.

---

## 🏗️ Fase 1: Fundaciones y Arquitectura Base (Shell App)

El **Shell App** es la aplicación anfitriona que orquestará la carga de todos los microfrontends, gestionará el enrutamiento principal y los estados globales transversales (como la sesión del usuario).

### Tareas (Shell):
- [ ] Inicializar el monorepo (Ej. usando Turborepo o Nx) para compartir configuraciones, librerías y dependencias.
- [ ] Configurar el **Shell App** con React y Webpack/Vite (configurando Module Federation Plugin).
- [ ] Definir e implementar el sistema de enrutamiento principal (`react-router-dom`).
- [ ] **UI Kit Compartido (Shared Library):** Crear un paquete interno o design system con Tailwind CSS para componentes comunes (Botones, Inputs, Modales, Tablas, Headers).
- [ ] Implementar un mecanismo de estado global compartido mínimo o un bus de eventos (Ej. `CustomEvents` o estado exportado de Module Federation) para compartir el JWT Token y el Rol del usuario entre los remotos.
- [ ] Integrar un Header global en el Shell que contenga la navegación principal, acceso a login/perfil y el "Mini Cart".

---

## 🔐 Fase 2: Auth App (Microfrontend de Autenticación)

Este microfrontend manejará el registro, inicio de sesión y almacenamiento seguro de los tokens. Debe ser inyectado en el Shell y proveer el estado de autenticación al resto de la aplicación.

### Tareas (Auth App):
- [ ] Inicializar el microfrontend `auth-app` y su configuración de exposición en Module Federation.
- [ ] **Página de Login (`/login`)**:
  - Implementar formulario con validaciones (Email y Password).
  - Integrar llamada a `POST /auth/login`.
  - Manejo de JWT: Guardar en localStorage/sessionStorage/cookies y notificar al Shell del estado activo del usuario.
- [ ] **Página de Registro (`/register`)**:
  - Implementar formulario (Nombre, Email, Password).
  - Integrar llamada a `POST /auth/register` (crea usuario con rol `CLIENT`).
  - Flujo de redirección al login post-registro.
- [ ] Exponer funciones utilitarias o Hooks para verificar si hay sesión activa, extraer roles del JWT (`CLIENT`, `ADMIN`, `SUPER_ADMIN`) y ejecutar logout.

---

## 🛍️ Fase 3: Catalog App (Microfrontend de Catálogo)

Microfrontend de acceso público. Responsable de mostrar productos, categorías y vista detallada.

### Tareas (Catalog App):
- [ ] Inicializar el microfrontend `catalog-app`.
- [ ] **Listado de Categorías**:
  - Integrar `GET /categories`.
  - Crear componente de filtros laterales o superiores de categorías.
- [ ] **Listado de Productos (`/`)**:
  - Integrar `GET /products` (con soporte para filtrar por `categoryId`).
  - Construir grid de tarjetas de producto mostrando información básica y precio.
- [ ] **Detalle del Producto (`/products/{id}`)**:
  - Integrar `GET /products/{id}`.
  - Botón interactivo "Agregar al Carrito" (Debe emitir un evento que la `cart-app` o el Shell escuchen para actualizar el estado).

---

## 🛒 Fase 4: Cart App (Microfrontend del Carrito)

Gestiona exclusivamente el carrito temporal de un usuario autenticado. 

### Tareas (Cart App):
- [ ] Inicializar el microfrontend `cart-app`.
- [ ] Proteger rutas para requerir autenticación (Redirigir a `/login` si no hay sesión).
- [ ] **Contexto del Carrito / Mini Cart**:
  - Integrar `GET /cart`.
  - Crear componente "Mini Cart" flotante o en el header mostrando el total de ítems.
- [ ] **Página del Carrito (`/cart`)**:
  - Listado de ítems `CartItem` con totalización.
  - Integrar adición: `POST /cart/items` (Llamado cuando Catalog App emite el evento de agregar).
  - Integrar modificación: `PUT /cart/items/{productId}` (Cambiar cantidad).
  - Integrar eliminación individual: `DELETE /cart/items/{productId}` y vaciado global `DELETE /cart`.
- [ ] Crear el botón de CTA "Proceder al Checkout" (Pasa el control a la Orders App para iniciar el pedido).

---

## 📦 Fase 5: Orders & Payments App (Microfrontend de Pedidos y Pago)

Maneja el Checkout a partir del carrito y la visualización de órdenes pasadas.

### Tareas (Orders App):
- [ ] Inicializar el microfrontend `orders-app` (Rutas protegidas).
- [ ] **Flujo de Creación de Pedido (Checkout)**:
  - Formulario para recoger la dirección de envío (`address`).
  - Integrar `POST /orders` para confirmar la intención de compra.
- [ ] **Flujo de Pago (Simulación)**:
  - Pantalla para confirmar el pago del pedido recién creado.
  - Integrar `POST /payments/process` pasándole el `orderId` y `amount` (que pasa el estado de la orden a `PAID`).
- [ ] **Historial de Pedidos (`/orders`)**:
  - Integrar `GET /orders` para ver las compras del usuario autenticado.
- [ ] **Detalle de Pedido (`/orders/{id}`)**:
  - Integrar `GET /orders/{id}` para mostrar ítems, estados (`CREATED`, `PAID`, `CANCELLED`) y totales.

---

## ⚙️ Fase 6: Admin App (Microfrontend de Administración)

Panel de control para operaciones del negocio. Acceso estrictamente protegido y validado en Frontend.

### Tareas (Admin App):
- [ ] Inicializar el microfrontend `admin-app`.
- [ ] Crear Layout (SideMenu, Dashboard) y **Guardianes de Ruta** (Validar rol `ADMIN` o `SUPER_ADMIN`).
- [ ] **Gestión de Catálogo (Req. `ADMIN`)**:
  - CRUD de Categorías: Vistas y formularios interactuando con `POST /categories`, `PUT /categories/{id}`, `DELETE /categories/{id}`.
  - CRUD de Productos: Vistas y formularios para crear/modificar productos (`POST /products`, `PUT /products/{id}`, `DELETE /products/{id}`).
- [ ] **Visualización Global de Pedidos (Req. `ADMIN`)**:
  - View interactivo (Tabla) conectándose a `GET /orders` global.
- [ ] **Gestión de Usuarios (Req. `SUPER_ADMIN`)**:
  - Vista condicional de usuarios listada de `GET /users`.
  - Crear usuarios administrativos con `POST /users`.
  - Cambiar roles condicionalmente con `PUT /users/{id}/role`.

---

## 🚀 Fase 7: Calidad, Testing y Entrega (Transversal)

- [ ] Implementar un manejador de errores global por Axios/Fetch interceptors en el *UI Kit* o *Shell* para controlar 401, 403, 404, y refrescar o vaciar sesión.
- [ ] Testing Unitario y de Integración con Jest o Vitest y React Testing Library para casos críticos (Validaciones en Formularios, reducers/estado).
- [ ] Testing End-to-End con Cypress o Playwright recorriendo el User Journey (Registro -> Login -> Catálogo -> Carrito -> Checkout).
- [ ] Escribir los Dockerfiles para servir el frontend optimizado mediante NGINX en builds separados.
