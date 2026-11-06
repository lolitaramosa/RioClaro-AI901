import { useEffect, useState } from "react";
import { leerExcel } from "../data/excelReader";
import VentasPorSucursal from "../components/VentasPorSucursal";

const moneda = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export default function DashboardEjecutivo() {
  const [indicadores, setIndicadores] = useState({
    ventas: 0,
    pedidos: 0,
    facturasPendientes: 0,
    productosCriticos: 0,
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarIndicadores = async () => {
      try {
        const [pedidos, facturas, inventario] = await Promise.all([
          leerExcel("/datos/Pedido.xlsx"),
          leerExcel("/datos/FacturaResumen.xlsx"),
          leerExcel("/datos/ProductoExistencia.xlsx"),
        ]);
        if (!activo) return;

        setIndicadores({
          ventas: pedidos.reduce(
            (total, pedido) => total + Number(pedido.MontoTotal || 0),
            0,
          ),
          pedidos: pedidos.length,
          facturasPendientes: facturas.filter(
            (factura) => factura.EstatusFactura !== "Pagada",
          ).length,
          productosCriticos: inventario.filter(
            (producto) => Number(producto.Existencia) <= 10,
          ).length,
        });
      } catch {
        if (activo) {
          setError("No fue posible cargar los indicadores. Intenta actualizar la página.");
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarIndicadores();
    return () => {
      activo = false;
    };
  }, []);

  const tarjetas = [
    {
      titulo: "Ventas totales",
      valor: moneda.format(indicadores.ventas),
      detalle: "Monto registrado en pedidos",
      icono: "$",
      tono: "#168f88",
      tint: "#e5f5f2",
    },
    {
      titulo: "Pedidos",
      valor: indicadores.pedidos.toLocaleString("es-MX"),
      detalle: "Pedidos registrados",
      icono: "P",
      tono: "#4778c7",
      tint: "#edf3ff",
    },
    {
      titulo: "Facturas pendientes",
      valor: indicadores.facturasPendientes.toLocaleString("es-MX"),
      detalle: "Requieren seguimiento",
      icono: "F",
      tono: "#bd7b24",
      tint: "#fff5e3",
    },
    {
      titulo: "Productos críticos",
      valor: indicadores.productosCriticos.toLocaleString("es-MX"),
      detalle: "Existencia de 10 unidades o menos",
      icono: "!",
      tono: "#c75d58",
      tint: "#fff0ef",
    },
  ];

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Centro de control</div>
          <h1>Resumen ejecutivo</h1>
          <p className="page-description">
            Una vista rápida de la operación de Río Claro.
          </p>
        </div>
        <div className="heading-note">
          Actualizado:{" "}
          {new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date())}
        </div>
      </div>

      {error && <div className="error-state" role="alert">{error}</div>}

      <section className="kpi-grid" aria-label="Indicadores ejecutivos">
        {tarjetas.map((tarjeta) => (
          <article
            className="kpi-card"
            key={tarjeta.titulo}
            style={{ "--accent": tarjeta.tono, "--tint": tarjeta.tint }}
          >
            <div className="kpi-topline">
              <span className="kpi-label">{tarjeta.titulo}</span>
              <span className="kpi-icon" aria-hidden="true">{tarjeta.icono}</span>
            </div>
            <div className="kpi-value">
              {cargando ? "—" : tarjeta.valor}
            </div>
            <div className="kpi-caption">{tarjeta.detalle}</div>
          </article>
        ))}
      </section>

      <VentasPorSucursal />
    </>
  );
}
