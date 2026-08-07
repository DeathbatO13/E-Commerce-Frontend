import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/routes/AppRouter";
import "./index.css";

/**
 * Bootstrap de la aplicación Shell.
 * Propósito: Renderizar la aplicación React en el DOM, inyectando el BrowserRouter y el enrutador global.
 *
 * @returns {void}
 * @throws {Error} Si no encuentra el elemento con id 'root'
 * @sideeffects Modifica el DOM principal del documento
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
);
