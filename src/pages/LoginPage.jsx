import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "@/services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    // Validación mínima del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un correo electrónico válido.");
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await login(email, password);
      console.log("Login exitoso:", response);
      // Aquí puedes redirigir al usuario a la página de inicio, guardar contexto, etc.
      // navigate("/");
    } catch (error) {
      const serverMessage = error?.response?.data?.message;
      if (serverMessage) {
        setError(serverMessage);
      } else {
        setError("Error al iniciar sesión. Verifica tus credenciales.");
      }
      console.error("Error al login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h1 className="text-[#0d141b] dark:text-white tracking-light text-[32px] font-bold leading-tight text-left pb-3">
        Iniciar Sesión
      </h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-[#0d141b] dark:text-slate-300 text-base font-medium leading-normal pb-2">
            Email
          </p>
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary h-14 placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal"
            placeholder="tu@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-[#0d141b] dark:text-slate-300 text-base font-medium leading-normal pb-2">
            Contraseña
          </p>
          <div className="flex w-full flex-1 items-stretch rounded-lg">
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary h-14 placeholder:text-slate-400 p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
              placeholder="Ingresa tu contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="text-slate-500 flex border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 items-center justify-center pr-[15px] rounded-r-lg border-l-0 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined">{
                showPassword ? "visibility_off" : "visibility"
              }</span>
            </div>
          </div>
        </label>

        <div className="flex justify-end">
          <Link
            className="block text-primary text-sm font-medium leading-normal underline hover:text-primary/80"
            to="/login/recover"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          className="flex w-full items-center justify-center rounded-lg bg-primary h-14 px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 flex items-center">
        <div className="flex-grow border-t border-gray-300 dark:border-slate-700"></div>
        <span className="mx-4 flex-shrink text-sm text-slate-500 dark:text-slate-400">O</span>
        <div className="flex-grow border-t border-gray-300 dark:border-slate-700"></div>
      </div>

      {/* Google Login Button */}
      <button className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-base font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.578 12.28c0-.79-.07-1.54-.2-2.28H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.06z"
            fill="#4285F4"
          />
          <path
            d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.57-2.77c-1.08.73-2.45 1.16-4.36 1.16-3.27 0-6.03-2.21-7.02-5.18H1.39v2.86C3.38 20.32 7.36 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M4.98 13.79c-.18-.54-.28-1.11-.28-1.7s.1-1.16.28-1.7V7.53H1.39C.49 9.36 0 11.12 0 12.87c0 1.75.49 3.51 1.39 5.34l3.59-2.82z"
            fill="#FBBC05"
          />
          <path
            d="M12 4.84c1.77 0 3.35.61 4.62 1.83l3.16-3.16C17.95 1.63 15.24 0 12 0 7.36 0 3.38 2.68 1.39 6.62l3.59 2.82C5.97 7.05 8.73 4.84 12 4.84z"
            fill="#EA4335"
          />
        </svg>
        <span>Continuar con Google</span>
      </button>
    </div>
  );
}
