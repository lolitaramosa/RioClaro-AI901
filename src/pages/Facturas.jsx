import { useEffect, useState } from "react";
import { leerExcel } from "../data/excelReader";

const moneda = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const fechaExcel = (valor) => {
  const fecha = new Date((Number(valor) - 25569) * 86400 * 1000);
  return Number.isNaN(fecha.getTime())
    ? "—"
    : new Intl.DateTimeFormat("es-MX").format(fecha);
};

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [estatus, setEstatus] = useState("Todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarFacturas = async () => {
      try {
        const [facturasData, proveedoresData] = await Promise.all([
          leerExcel("/datos/FacturaResumen.xlsx"),
          leerExcel("/datos/Proveedor.xlsx"),
        ]);
        if (!activo) return;

        const facturasCompletas = facturasData.map((factura) => {
          const proveedor = proveedoresData.find(
            (elemento) =>
              String(elemento.ID_Proveedor) === String(factura.ID_Proveedor),
          );
          return {
            ...factura,
            ProveedorNombre: proveedor?.RazonSocial || "Proveedor no encontrado",
          };
        });

        setFacturas(facturasCompletas);
      } catch {
        if (activo) setError("No fue posible cargar las facturas.");
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarFacturas();
    return () => {
      activo = false;
    };
  }, []);

  const facturasFiltradas =
    estatus === "Todas"
      ? facturas
      : facturas.filter((factura) => factura.EstatusFactura === estatus);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Cuentas por pagar</div>
          <h1>Facturas</h1>
          <p className="page-description">
            Da seguimiento a las facturas de proveedores y sus vencimientos.
          </p>
        </div>
      </div>

      {error && <div className="error-state" role="alert">{error}</div>}

      <section className="table-card">
        <div className="table-toolbar">
          <p>
            <strong>{cargando ? "…" : facturasFiltradas.length}</strong>{" "}
            {facturasFiltradas.length === 1 ? "factura" : "facturas"}
          </p>
          <label className="toolbar-control">
            Estatus
            <select
              value={estatus}
              onChange={(event) => setEstatus(event.target.value)}
              aria-label="Filtrar facturas por estatus"
            >
              <option>Todas</option>
              <option>Pagada</option>
              <option>Pendiente</option>
              <option>Vencida</option>
              <option>En revisión</option>
            </select>
          </label>
        </div>

        {cargando ? (
          <div className="empty-state" aria-live="polite">Cargando facturas…</div>
        ) : facturasFiltradas.length === 0 ? (
          <div className="empty-state">No hay facturas con este estatus.</div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Proveedor</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Estatus</th>
                </tr>
              </thead>
              <tbody>
                {facturasFiltradas.map((factura, index) => (
                  <tr key={factura.NumeroFactura ?? index}>
                    <td>{factura.NumeroFactura}</td>
                    <td>{factura.ProveedorNombre}</td>
                    <td>{fechaExcel(factura.FechaFactura)}</td>
                    <td>{moneda.format(Number(factura.MontoTotal || 0))}</td>
                    <td>
                      <span
                        className="status-pill"
                        data-status={String(factura.EstatusFactura || "").toLowerCase()}
                      >
                        {factura.EstatusFactura || "Sin estatus"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
