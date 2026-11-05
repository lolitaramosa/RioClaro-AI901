import { useState } from "react";

import Navbar from "../components/Navbar";

import DashboardEjecutivo from "./DashboardEjecutivo";
import Inventario from "./Inventario";
import Facturas from "./Facturas";
import Pedidos from "./Pedidos";

export default function Dashboard({
  usuario
}) {

  const [pantalla, setPantalla] =
    useState("dashboard");

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
        
      </div>
    </div>
  );
}
