import { useState } from "react";

import Navbar from "../components/Navbar";

import DashboardEjecutivo from "./DashboardEjecutivo";
import Inventario from "./Inventario";
import Facturas from "./Facturas";
import Pedidos from "./Pedidos";
import ChatIA from "./ChatIA";

export default function Dashboard({
  usuario
}) {

 const obtenerPantallaInicial = () => {

  if (usuario.rol === "Bodega") {
    return "inventario";
  }

  if (usuario.rol === "Vendedor") {
    return "pedidos";
  }

  if (usuario.rol === "CtasXPagar") {
    return "facturas";
  }

  return "dashboard";
};

const [pantalla, setPantalla] =
  useState(obtenerPantallaInicial());

  return (
    <div
      style={{
        display: "flex"
      }}
    >
      <Navbar
        usuario={usuario}
        setPantalla={setPantalla}
      />

      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        {pantalla === "dashboard" && (
          <DashboardEjecutivo />
        )}

        {pantalla === "inventario" && (
          <Inventario />
        )}

        {pantalla === "facturas" && (
          <Facturas />
        )}

        {pantalla === "pedidos" && (
          <Pedidos />
        )}
  
        {pantalla === "chat" && (
            <ChatIA />
        )}

      </div>
    </div>
  );
}
