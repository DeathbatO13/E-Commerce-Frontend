# E-Commerce Frontend (MVP)

Bienvenido al repositorio Frontend de la plataforma E-Commerce. Este proyecto demuestra un enfoque de arquitectura escalable, orientado a buenas prácticas y separación de responsabilidades.

## Visión General

El Frontend de esta aplicación está construido utilizando una arquitectura moderna basada en **Microfrontends**. Se compone de una aplicación principal (Shell) y múltiples aplicaciones independientes que se integran en tiempo de ejecución. 

### Tecnologías Principales
- **React**: Biblioteca principal para la creación de interfaces de usuario.
- **Vite**: Bundler rápido y moderno.
- **Module Federation** (`@originjs/vite-plugin-federation`): Tecnología núcleo que permite la división del código en aplicaciones remotas que se consumen desde la aplicación Shell.
- **Tailwind CSS**: Framework de utilidades para un diseño rápido, responsivo y mantenible.
- **React Router**: Para el manejo de las rutas en el lado del cliente.

## Estructura de la Aplicación

La aplicación se divide lógicamente en varios paquetes/microfrontends:

- **Shell**: Orquestador principal. Aloja el layout, la navegación global y carga los remotos.
- **Auth App**: Encargado del inicio de sesión, registro y gestión de sesión segura.
- **Catalog App**: Visualización de los productos, listados y categorías.
- **Cart App**: Gestión de ítems agregados al carrito temporal.
- **Orders App**: Flujo de checkout y revisión del historial de pedidos del usuario.
- **Admin App**: Panel de administración restringido, para la gestión de inventario y usuarios.

## Patrones y Convenciones

El proyecto adopta reglas estrictas de desarrollo para mantener la consistencia a lo largo de todos los microfrontends:

- **Arquitectura Limpia en UI**: Separación clara entre Vistas (`pages`), Lógica de Estado (`hooks`), Componentes Reutilizables (`components`) y llamadas a red (`services`).
- **Fetch Nativo**: Se prioriza el uso de la API nativa de fetch para las peticiones HTTP, encapsulando siempre el manejo de errores.
- **Microfrontends Independientes**: Cada aplicación remota debe ser capaz de correr de manera autónoma en su entorno local de desarrollo para facilitar su depuración y testeo.

## Requisitos de Instalación (Desarrollo)

Para levantar este proyecto localmente, necesitas tener **Node.js** (recomendado v18 o superior). El proyecto usa un monorepo, por lo cual es aconsejable instalar las dependencias en cada paquete según sea necesario, o usar herramientas de gestión de monorepos si están configuradas.

```bash
# Ejemplo genérico
npm install
npm run dev
```

*(Consulta los scripts específicos en el `package.json` para levantar el entorno completo)*

## Estado del Proyecto

🚧 **En desarrollo (MVP)**

Este proyecto es parte de un MVP enfocado en demostrar habilidades técnicas avanzadas, por lo que muchas funciones complejas de negocio (como logística real y pasarelas de pago externas) han sido simuladas o postergadas.
