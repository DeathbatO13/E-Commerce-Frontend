import axios from "axios";

/**
 * Instancia base de axios configurada para el backend de Spring Boot.
 * Puedes cambiar la URL base aquí cuando el backend esté disponible.
 *
 * Uso: import api from '@/services/api'
 */
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor de respuestas: manejo global de errores (opcional).
 * Por ejemplo, redirigir a login si el token expira (401).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si obtienes un 401, podrías limpiar el token y redirigir a login
    if (error.response?.status === 401) {
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
