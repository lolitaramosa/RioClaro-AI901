import { useEffect, useState } from "react";
import { leerExcel } from "../data/excelReader";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function VentasPorSucursal() {

  const [datos, setDatos] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {

    const pedidos = await leerExcel(
      "/datos/Pedido.xlsx"
    );

    const sucursales = await leerExcel(
      "/datos/Sucursal.xlsx"
    );

    const ventasPorSucursal = {};

    pedidos.forEach((pedido) => {

      const sucursal = sucursales.find(
        (s) =>
          s["ID_sucursal "] ==
          pedido.ID_Sucursal
      );

      const nombre =
        sucursal?.nombre_sucursal ||
        "Sin nombre";

      ventasPorSucursal[nombre] =
        (ventasPorSucursal[nombre] || 0) +
        Number(pedido.MontoTotal);
    });

    const resultado =
      Object.entries(
        ventasPorSucursal
      ).map(([nombre, ventas]) => ({
        nombre,
        ventas
      }));

    setDatos(resultado);
  };

  return (
    <div
    style={{
      marginTop: "30px",
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
      <h2>
        Ventas por Sucursal
      </h2>

     <ResponsiveContainer
        width="100%"
        height={450}
    >
        <BarChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="nombre"
            angle={-20}
            textAnchor="end"
            interval={0}
             height={90}
        />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="ventas"
            fill="#2563eb"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}