import api from "./api";

/**
 * Servicio de autenticación.
 * Contiene las funciones para login, registro y recuperación de contraseña.
 *
 * Cuando el backend esté listo, solo cambias la URL base en api.js
 * y estas funciones seguirán funcionando sin cambios.
 */

/**
 * Realiza el login del usuario.
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} Respuesta con token, usuario, etc.
 */
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    // Opcionalmente, guardar el token en localStorage
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      // También podrías guardar el usuario:
      // localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Registra un nuevo usuario.
 * @param {object} userData - { fullName, email, password }
 * @returns {Promise} Respuesta con token, usuario, etc.
 */
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", {
      name: userData.fullName,
      email: userData.email,
      password: userData.password,
    });
    // Opcionalmente, guardar el token en localStorage tras registro exitoso
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Solicita recuperación de contraseña.
 * @param {string} email - Email del usuario
 * @returns {Promise} Respuesta del servidor
 */
export const recoverPassword = async (email) => {
  try {
    const response = await api.post("/auth/recover", {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout del usuario (opcional, limpia el token).
 */
export const logout = () => {
  localStorage.removeItem("token");
  // localStorage.removeItem("user");
};

/**
 * Obtiene el token del localStorage.
 * Útil para verificar si el usuario está logueado.
 */
export const getToken = () => {
  return localStorage.getItem("token");
};
