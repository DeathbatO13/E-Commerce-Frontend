# E-Commerce Frontend (MVP)

Bienvenido al repositorio Frontend de la plataforma E-Commerce. Este proyecto demuestra un enfoque de arquitectura escalable, orientado a buenas prácticas y separación de responsabilidades.

## Visión General

El Frontend de esta aplicación está construido utilizando una arquitectura moderna basada en **Microfrontends**. Se compone de una aplicación principal (Shell) y múltiples aplicaciones independientes que se integran en tiempo de ejecución.

### Tecnologías Principales
- **React 19**: Biblioteca principal para la creación de interfaces de usuario.
- **Vite 7**: Bundler rápido y moderno.
- **Module Federation** (`@originjs/vite-plugin-federation`): Tecnología núcleo que permite la división del código en aplicaciones remotas que se consumen desde la aplicación Shell.
- **Tailwind CSS 3**: Framework de utilidades para un diseño rápido, responsivo y mantenible.
- **React Router 7**: Para el manejo de las rutas en el lado del cliente.
- **Turborepo + npm workspaces**: Orquestación del monorepo.
- **Vercel**: Plataforma de despliegue (un proyecto por microfrontend).

## Estructura de la Aplicación

| App | Puerto | Responsabilidad | Estado | README |
|---|---|---|---|---|
| **Shell** | 5000 | Orquestador: layout, navegación global y carga de remotos. | 🟡 Parcial | [shell/](shell/README.md) |
| **Auth App** | 5001 | Inicio de sesión, registro y sesión (JWT). | 🟢 Completa | [auth-app/](auth-app/README.md) |
| **Catalog App** | 5002 | Listado de productos, categorías y detalle. | 🟢 Completa | [catalog-app/](catalog-app/README.md) |
| **Cart App** | 5003 | Carrito del usuario autenticado. | 🟡 UI sobre datos mock | [cart-app/](cart-app/README.md) |
| **Orders App** | 5004 | Checkout, pago simulado e historial de pedidos. | 🔴 Placeholder | [orders-app/](orders-app/README.md) |
| **Admin App** | 5005 | Panel de administración de catálogo, pedidos y usuarios. | 🔴 Placeholder | [admin-app/](admin-app/README.md) |

Cada README de app documenta sus rutas, lo que expone y consume por Module Federation, los eventos que emite o escucha y sus variables de entorno.

## Patrones y Convenciones

El proyecto adopta reglas estrictas de desarrollo para mantener la consistencia a lo largo de todos los microfrontends:

- **Arquitectura Limpia en UI**: Separación clara entre Vistas (`pages`), Lógica de Estado (`hooks`), Componentes Reutilizables (`components`) y llamadas a red (`services`).
- **Fetch Nativo**: Se prioriza el uso de la API nativa de fetch para las peticiones HTTP, encapsulando siempre el manejo de errores.
- **Microfrontends Independientes**: Cada aplicación remota debe ser capaz de correr de manera autónoma en su entorno local de desarrollo para facilitar su depuración y testeo.
- **Comunicación por eventos**: Los remotos se comunican con `CustomEvent` sobre `window` (bus en `shell/src/core/events/eventBus.js`), nunca importando archivos de otro microfrontend.

## Requisitos de Instalación (Desarrollo)

Necesitas **Node.js 18 o superior** y **npm** (la versión exacta está fijada en `packageManager` del `package.json`). Instala siempre desde la raíz: el monorepo usa npm workspaces con un único `package-lock.json`.

```bash
npm install
```

Copia el archivo de variables de entorno. Todas las apps leen el `.env` de la **raíz** del monorepo:

```bash
cp .env.example .env
```

Levanta las 6 apps a la vez y abre el shell en `http://127.0.0.1:5000`:

```bash
npm run dev:all
```

### Scripts de la raíz

| Script | Qué hace |
|---|---|
| `npm run dev:all` | Levanta las 6 apps con `concurrently` (recomendado). |
| `npm run dev` | Igual, pero orquestado por Turborepo. |
| `npm run build` | Compila las 6 apps (`turbo run build`). |
| `npm run preview` | Compila y sirve las 6 apps en modo producción. |
| `npm run lint` | Ejecuta ESLint en cada app. Hoy solo el shell tiene configuración (ver backlog §11). |

Los remotos se sirven con `vite build --watch` + `vite preview`, no con el servidor de desarrollo de Vite: el plugin de federation necesita compilar para publicar `remoteEntry.js`. Por eso los cambios en un remoto no tienen HMR y requieren recargar la página.

### Variables de entorno

Documentadas en [`.env.example`](.env.example):

- `VITE_*_REMOTE_URL`: URL del `remoteEntry.js` de cada microfrontend. Se resuelven en **build time**.
- `VITE_*_API_URL`: URL base de cada microservicio del backend (puertos `8081`–`8085` en local).

## Despliegue

El destino de despliegue es **Vercel**: cada microfrontend es un proyecto Vercel independiente sobre este mismo repositorio, con su propio *Root Directory*. Los remotos se despliegan primero y el Shell al final, con las variables `VITE_*_REMOTE_URL` apuntando a los dominios de cada remoto. El plan completo está en la [Fase 8 del Roadmap](Roadmap-Microfrontends.md) y en el [backlog §10](docs/backlog-mvp.md).

## Documentación

| Documento | Contenido |
|---|---|
| [Roadmap-Microfrontends.md](Roadmap-Microfrontends.md) | Fases del MVP y estado de cada tarea. |
| [docs/backlog-mvp.md](docs/backlog-mvp.md) | Desglose técnico, deuda conocida y decisiones pendientes. |
| [docs/architecture/ReadMe.md](docs/architecture/ReadMe.md) | Arquitectura del sistema (modelo C4). |
| [docs/busines-rules.md](docs/busines-rules.md) | Reglas de negocio globales. |
| [docs/openapi/](docs/openapi/) | Contratos de los microservicios del backend. |

## Estado del Proyecto

🚧 **En desarrollo (MVP)**

Este proyecto es parte de un MVP enfocado en demostrar habilidades técnicas avanzadas, por lo que muchas funciones complejas de negocio (como logística real y pasarelas de pago externas) han sido simuladas o postergadas. El avance por fase está en el [Roadmap](Roadmap-Microfrontends.md).
