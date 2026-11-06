import { useEffect, useState } from "react";
import { leerExcel } from "../data/excelReader";

const moneda = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarPedidos = async () => {
      try {
        const [pedidosData, clientesData, sucursalesData] = await Promise.all([
          leerExcel("/datos/Pedido.xlsx"),
          leerExcel("/datos/Cliente.xlsx"),
          leerExcel("/datos/Sucursal.xlsx"),
        ]);
        if (!activo) return;

        setPedidos(
          pedidosData.map((pedido) => {
            const cliente = clientesData.find(
              (elemento) =>
                String(elemento.ID_Cliente) === String(pedido.ID_Cliente),
            );
            const sucursal = sucursalesData.find(
              (elemento) =>
                String(elemento["ID_sucursal "]) === String(pedido.ID_Sucursal),
            );

            return {
              ...pedido,
              ClienteNombre: cliente?.RazonSocial || "Cliente no encontrado",
              SucursalNombre: sucursal?.nombre_sucursal || "Sucursal no encontrada",
            };
          }),
        );
      } catch {
        if (activo) setError("No fue posible cargar los pedidos.");
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarPedidos();
    return () => {
      activo = false;
    };
  }, []);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Operación</div>
          <h1>Pedidos</h1>
          <p className="page-description">Consulta los pedidos y su información principal.</p>
        </div>
      </div>

      {error && <div className="error-state" role="alert">{error}</div>}

      <section className="table-card">
        <div className="table-toolbar">
          <p>
            <strong>{cargando ? "…" : pedidos.length}</strong>{" "}
            {pedidos.length === 1 ? "pedido registrado" : "pedidos registrados"}
          </p>
        </div>
        {cargando ? (
          <div className="empty-state" aria-live="polite">Cargando pedidos…</div>
        ) : pedidos.length === 0 ? (
          <div className="empty-state">No hay pedidos para mostrar.</div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID pedido</th>
                  <th>Cliente</th>
                  <th>Sucursal</th>
                  <th>Monto</th>
                  <th>Estatus</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido, index) => (
                  <tr key={pedido.ID_Pedido ?? index}>
                    <td>{pedido.ID_Pedido}</td>
                    <td>{pedido.ClienteNombre}</td>
                    <td>{pedido.SucursalNombre}</td>
                    <td>{moneda.format(Number(pedido.MontoTotal || 0))}</td>
                    <td>
                      <span
                        className="status-pill"
                        data-status={String(pedido.Estatus || "").toLowerCase()}
                      >
                        {pedido.Estatus || "Sin estatus"}
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
