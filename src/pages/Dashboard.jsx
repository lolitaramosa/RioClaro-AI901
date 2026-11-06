import { useState } from "react";

import Navbar from "../components/Navbar";
import DashboardEjecutivo from "./DashboardEjecutivo";
import Inventario from "./Inventario";
import Facturas from "./Facturas";
import Pedidos from "./Pedidos";
import ChatIA from "./ChatIA";
import PeticionesCompra from "./PeticionesCompra";

const nombresPantalla = {
  dashboard: "Resumen ejecutivo",
  inventario: "Inventario",
  facturas: "Facturas",
  pedidos: "Pedidos",
  chat: "Asistente IA",
  peticiones: "Peticiones de compra",
};

export default function Dashboard({ usuario, cerrarSesion }) {
  const obtenerPantallaInicial = () => {
    if (usuario.rol === "Bodega") return "inventario";
    if (usuario.rol === "Vendedor") return "pedidos";
    if (usuario.rol === "CtasXPagar") return "facturas";
    return "dashboard";
  };

  const [pantalla, setPantalla] = useState(obtenerPantallaInicial);
  const fecha = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
  }).format(new Date());

  return (
    <div className="app-shell">
      <Navbar
        usuario={usuario}
        pantalla={pantalla}
        setPantalla={setPantalla}
        cerrarSesion={cerrarSesion}
      />

      <main className="workspace">
        <header className="topbar">
          <div className="topbar-title">{nombresPantalla[pantalla]}</div>
          <div className="topbar-meta">
            <span className="online-dot" aria-hidden="true" />
            <span>Portal Río Claro</span>
            <span aria-hidden="true">·</span>
            <time>{fecha}</time>
          </div>
        </header>

        <div className="page-content">
          {pantalla === "dashboard" && <DashboardEjecutivo />}
          {pantalla === "inventario" && <Inventario />}
          {pantalla === "facturas" && <Facturas />}
          {pantalla === "pedidos" && <Pedidos />}
          {pantalla === "chat" && <ChatIA />}
          {pantalla === "peticiones" && <PeticionesCompra />}
        </div>
      </main>
    </div>
  );
}
