import { Component } from "react";

/**
 * Componente RemoteErrorBoundary — Aísla fallos de un microfrontend remoto.
 * Propósito: Si un `remoteEntry.js` no carga o el remoto lanza un error al renderizar, mostrar
 * `fallback` en lugar de tumbar todo el Shell.
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido que carga el remoto
 * @param {React.ReactNode} [props.fallback=null] - Qué mostrar si falla
 * @returns {JSX.Element} El contenido o el fallback
 * @throws {None}
 * @sideeffects Registra el error en consola
 */
class RemoteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Error al cargar un microfrontend remoto:", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default RemoteErrorBoundary;
