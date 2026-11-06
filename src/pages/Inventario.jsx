import { useEffect, useState } from "react";
import { leerExcel } from "../data/excelReader";

export default function Inventario() {
  const [datos, setDatos] = useState([]);
  const [soloCriticos, setSoloCriticos] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarDatos = async () => {
      try {
        const [existencias, productos, sucursales] = await Promise.all([
          leerExcel("/datos/ProductoExistencia.xlsx"),
          leerExcel("/datos/Producto.xlsx"),
          leerExcel("/datos/Sucursal.xlsx"),
        ]);
        if (!activo) return;

        const datosCombinados = existencias.map((existencia) => {
          const producto = productos.find(
            (elemento) =>
              String(elemento.ID_Producto) === String(existencia.ID_producto),
          );
          const sucursal = sucursales.find(
            (elemento) =>
              String(elemento["ID_sucursal "]) ===
              String(existencia["ID_sucursal "]),
          );

          return {
            id: existencia.ID_producto_existencia,
            producto: producto?.NombreProducto || "No encontrado",
            sucursal: sucursal?.nombre_sucursal || "No encontrada",
            existencia: Number(existencia.Existencia || 0),
          };
        });

        setDatos(datosCombinados);
      } catch {
        if (activo) setError("No fue posible cargar el inventario.");
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarDatos();
    return () => {
      activo = false;
    };
  }, []);

  const datosFiltrados = soloCriticos
    ? datos.filter((dato) => dato.existencia <= 10)
    : datos;

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Existencias</div>
          <h1>Inventario</h1>
          <p className="page-description">
            Consulta las existencias disponibles en cada sucursal.
          </p>
        </div>
      </div>

      {error && <div className="error-state" role="alert">{error}</div>}

      <section className="table-card">
        <div className="table-toolbar">
          <p>
            <strong>{cargando ? "…" : datosFiltrados.length}</strong>{" "}
            {datosFiltrados.length === 1 ? "registro" : "registros"}
          </p>
          <label className="filter-check">
            <input
              type="checkbox"
              checked={soloCriticos}
              onChange={(event) => setSoloCriticos(event.target.checked)}
            />
            Mostrar inventario crítico (10 unidades o menos)
          </label>
        </div>

        {cargando ? (
          <div className="empty-state" aria-live="polite">Cargando inventario…</div>
        ) : datosFiltrados.length === 0 ? (
          <div className="empty-state">
            {soloCriticos
              ? "No hay productos con existencias críticas."
              : "No hay registros de inventario para mostrar."}
          </div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Sucursal</th>
                  <th>Existencia</th>
                </tr>
              </thead>
              <tbody>
                {datosFiltrados.map((dato, index) => (
                  <tr key={dato.id ?? index}>
                    <td>{dato.id}</td>
                    <td>{dato.producto}</td>
                    <td>{dato.sucursal}</td>
                    <td>
                      <span
                        className={`status-pill${dato.existencia <= 10 ? " critical-stock" : ""}`}
                        data-status={dato.existencia <= 10 ? "crítico" : "completado"}
                      >
                        {dato.existencia}
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
