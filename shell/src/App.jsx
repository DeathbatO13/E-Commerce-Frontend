import { useState } from 'react'
import AppRouter from './app/routes/AppRouter'

/**
 * Componente App — Aplicación principal (Shell).
 * Propósito: Proveer el punto de entrada principal y configuración inicial de la aplicación.
 * 
 * @returns {JSX.Element} El enrutador principal de la aplicación
 * @throws {None}
 * @sideeffects Ninguno
 */
function App() {
  return (
    <AppRouter />
  );
}

export default App
