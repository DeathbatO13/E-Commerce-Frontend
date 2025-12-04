import { useState } from "react";
import { Link } from "react-router-dom";
import { recoverPassword } from "@/services/authService";

export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un correo electrónico válido.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await recoverPassword(email);
      const message = response?.message ||
        "Si existe una cuenta con ese email, se ha enviado un enlace de recuperación. Revisa tu bandeja de entrada.";
      setSuccess(message);
      setEmail("");
    } catch (err) {
      const serverMessage = err?.response?.data?.message;
      if (serverMessage) {
        setError(serverMessage);
      } else {
        setError("Error al enviar el correo. Verifica que el servidor esté disponible.");
      }
      console.error("Error al recuperar contraseña:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="w-12 h-12 flex items-center justify-center bg-primary/10 dark:bg-primary/20 rounded-full mb-2">
          <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
        </div>
        <h1 className="text-[#0d141b] dark:text-white tracking-light text-[24px] font-bold leading-tight text-left">
          Recuperar Contraseña
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-left max-w-md">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-[#0d141b] dark:text-slate-300 text-base font-medium leading-normal pb-2">
            Correo Electrónico
          </p>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-slate-400 dark:text-slate-500 text-xl">mail</span>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary h-12 placeholder:text-slate-400 p-[15px] pl-11 text-base font-normal leading-normal"
              placeholder="tu@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-lg bg-primary h-12 px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? "Enviando..." : "Enviar Enlace de Recuperación"}
        </button>
      </form>

      <div className="mt-6">
        <Link to="/login" className="text-primary hover:underline text-sm font-medium">
          ¿Ya te acordaste? Volver a Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}
