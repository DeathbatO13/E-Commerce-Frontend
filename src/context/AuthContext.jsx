import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Hook para usar el contexto
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = no autenticado
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario desde localStorage al iniciar la app
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ------------------------------------------
  // Función mock de Login
  // ------------------------------------------
  function login(email, password) {
    // Validación falsa para prueba
    if (email === "test@test.com" && password === "123456") {
      const userData = { email };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { ok: true };
    }
    return { ok: false, message: "Credenciales incorrectas" };
  }

  // ------------------------------------------
  // Función mock de Registro
  // ------------------------------------------
  function register(name, email, password) {
    const userData = { name, email };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return { ok: true };
  }

  // ------------------------------------------
  // Logout
  // ------------------------------------------
  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
