import { useEffect, useState } from "react";
import { leerExcel } from "../data/excelReader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const moneda = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export default function VentasPorSucursal() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarDatos = async () => {
      try {
        const [pedidos, sucursales] = await Promise.all([
          leerExcel("/datos/Pedido.xlsx"),
          leerExcel("/datos/Sucursal.xlsx"),
        ]);
        if (!activo) return;

        const ventasPorSucursal = {};
        pedidos.forEach((pedido) => {
          const sucursal = sucursales.find(
            (elemento) =>
              String(elemento["ID_sucursal "]) === String(pedido.ID_Sucursal),
          );
          const nombre = sucursal?.nombre_sucursal || "Sin nombre";
          ventasPorSucursal[nombre] =
            (ventasPorSucursal[nombre] || 0) + Number(pedido.MontoTotal || 0);
        });

        setDatos(
          Object.entries(ventasPorSucursal).map(([nombre, ventas]) => ({
            nombre,
            ventas,
          })),
        );
      } catch {
        if (activo) setError("No fue posible cargar las ventas por sucursal.");
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarDatos();
    return () => {
      activo = false;
    };
  }, []);

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Ventas por sucursal</h2>
          <p>Distribución del monto registrado en pedidos.</p>
        </div>
      </div>

      {error ? (
        <div className="error-state" role="alert">{error}</div>
      ) : cargando ? (
        <div className="empty-state" aria-live="polite">Cargando ventas…</div>
      ) : datos.length === 0 ? (
        <div className="empty-state">No hay ventas disponibles para mostrar.</div>
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datos}
              margin={{ top: 8, right: 12, bottom: 8, left: 8 }}
              barCategoryGap="35%"
            >
              <CartesianGrid stroke="#edf1f5" vertical={false} />
              <XAxis
                dataKey="nombre"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#78879a", fontSize: 11 }}
                tickMargin={12}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#78879a", fontSize: 10 }}
                tickFormatter={(value) => `$${Number(value).toLocaleString("es-MX")}`}
                width={75}
              />
              <Tooltip
                cursor={{ fill: "#f5f8fa" }}
                formatter={(value) => [moneda.format(Number(value)), "Ventas"]}
                contentStyle={{
                  border: "1px solid #e6ebf0",
                  borderRadius: 9,
                  boxShadow: "0 8px 24px rgb(28 43 60 / 10%)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="ventas" fill="#168f88" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
