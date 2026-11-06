import { useEffect, useState } from "react";
import { leerExcel } from "../data/excelReader";

const fechaExcel = (valor) => {
  const fecha = new Date((Number(valor) - 25569) * 86400 * 1000);
  return Number.isNaN(fecha.getTime())
    ? "—"
    : new Intl.DateTimeFormat("es-MX").format(fecha);
};

export default function PeticionesCompra() {
  const [peticiones, setPeticiones] = useState([]);
  const [estatus, setEstatus] = useState("Todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarPeticiones = async () => {
      try {
        const [peticionesData, productosData, sucursalesData] = await Promise.all([
          leerExcel("/datos/PeticionCompra.xlsx"),
          leerExcel("/datos/Producto.xlsx"),
          leerExcel("/datos/Sucursal.xlsx"),
        ]);
        if (!activo) return;

        setPeticiones(
          peticionesData.map((peticion) => {
            const producto = productosData.find(
              (elemento) =>
                String(elemento.ID_Producto) === String(peticion[" ID_producto"]),
            );
            const sucursal = sucursalesData.find(
              (elemento) =>
                String(elemento["ID_sucursal "]) === String(peticion.ID_sucursal),
            );

            return {
              ...peticion,
              ProductoNombre: producto?.NombreProducto || "Producto no encontrado",
              SucursalNombre: sucursal?.nombre_sucursal || "Sucursal no encontrada",
            };
          }),
        );
      } catch {
        if (activo) setError("No fue posible cargar las peticiones de compra.");
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarPeticiones();
    return () => {
      activo = false;
    };
  }, []);

  const peticionesFiltradas =
    estatus === "Todas"
      ? peticiones
      : peticiones.filter((peticion) => peticion["estatus "] === estatus);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Abastecimiento</div>
          <h1>Peticiones de compra</h1>
          <p className="page-description">
            Revisa las solicitudes de producto por sucursal y su estatus.
          </p>
        </div>
      </div>

      {error && <div className="error-state" role="alert">{error}</div>}

      <section className="table-card">
        <div className="table-toolbar">
          <p>
            <strong>{cargando ? "…" : peticionesFiltradas.length}</strong>{" "}
            {peticionesFiltradas.length === 1 ? "petición" : "peticiones"}
          </p>
          <label className="toolbar-control">
            Estatus
            <select
              value={estatus}
              onChange={(event) => setEstatus(event.target.value)}
              aria-label="Filtrar peticiones por estatus"
            >
              <option>Todas</option>
              <option>Registrado</option>
              <option>Aprobado</option>
            </select>
          </label>
        </div>

        {cargando ? (
          <div className="empty-state" aria-live="polite">Cargando peticiones…</div>
        ) : peticionesFiltradas.length === 0 ? (
          <div className="empty-state">No hay peticiones con este estatus.</div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID compra</th>
                  <th>Producto</th>
                  <th>Sucursal</th>
                  <th>Cantidad</th>
                  <th>Fecha</th>
                  <th>Estatus</th>
                </tr>
              </thead>
              <tbody>
                {peticionesFiltradas.map((peticion, index) => {
                  const estado = peticion["estatus "];
                  return (
                    <tr key={peticion.ID_compra ?? index}>
                      <td>{peticion.ID_compra}</td>
                      <td>{peticion.ProductoNombre}</td>
                      <td>{peticion.SucursalNombre}</td>
                      <td>{peticion.cantidad_solicitada}</td>
                      <td>{fechaExcel(peticion.fecha_peticion)}</td>
                      <td>
                        <span
                          className="status-pill"
                          data-status={String(estado || "").toLowerCase()}
                        >
                          {estado || "Sin estatus"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
