# Auth App

Microfrontend de autenticación: login, registro y manejo del JWT. Expone además el servicio y los hooks de
sesión para que el shell y los demás remotos sepan si hay usuario y con qué rol.

| | |
|---|---|
| **Puerto** | `5001` |
| **Rol en MF** | Remoto |
| **Estado** | 🟢 Completa (ver [Roadmap, Fase 2](../Roadmap-Microfrontends.md)) |
| **API** | [`docs/openapi/auth.yaml`](../docs/openapi/auth.yaml) |

## Rutas

El shell monta `AuthApp` en `/login` y `/register`; el componente decide qué página mostrar según el
`pathname`.

| Ruta | Página | Endpoint |
|---|---|---|
| `/login` | `LoginPage` | `POST /auth/login` → guarda el token y navega a `/` |
| `/register` | `RegisterPage` | `POST /auth/register` → navega a `/login` |

## Module Federation

**Expone**:

| Módulo | Contenido |
|---|---|
| `authApp/AuthApp` | Componente raíz (login/registro) |
| `authApp/authService` | `login`, `register`, `getToken`, `getSession`, `getRole`, `decodeToken`, `isTokenExpired`, `logout`, `AUTH_SESSION_EVENT` |
| `authApp/useAuth` | `useLogin`, `useRegister`, `useAuthSession` |

**Consume**: ningún remoto. **Compartido**: `react`, `react-dom`, `react-router-dom`.

## Sesión

- El JWT se guarda en `localStorage` con la clave `ecommerce.accessToken`.
- Cada cambio de sesión (guardar o borrar el token) emite `ecommerce:auth-session-change` en `window`, con
  el detalle `{ isAuthenticated, role, token }`.
- El rol se lee del claim `role` del JWT (decodificado en el cliente, sin verificar la firma). El backend
  sigue siendo la autoridad.
- Un token vencido (claim `exp`) se elimina al leer la sesión. Todavía no hay expiración proactiva mientras
  se navega.

## Variables de entorno

Se leen del `.env` de la raíz del monorepo (ver [`.env.example`](../.env.example)).

| Variable | Uso | Fallback |
|---|---|---|
| `VITE_AUTH_API_URL` | Base URL del Auth Service | `http://localhost:8081` |

## Desarrollo

```bash
npm run dev --workspace=auth-app   # build --watch + preview en 127.0.0.1:5001
```

Para probarla sola abre `http://127.0.0.1:5001` (bootstrap standalone en `src/main.jsx`). No tiene HMR:
el plugin de federation necesita compilar para publicar `remoteEntry.js`.

## Despliegue

Proyecto Vercel con *Root Directory* `auth-app/`. Se despliega antes que el shell, `catalog-app` y
`cart-app`, que lo consumen. Ver [backlog §10](../docs/backlog-mvp.md).
