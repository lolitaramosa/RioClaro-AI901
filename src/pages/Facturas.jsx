import { useEffect, useState } from "react";
import { leerExcel } from "../data/excelReader";

export default function Facturas() {

  const [facturas, setFacturas] = useState([]);
  const [estatus, setEstatus] = useState("Todas");

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {

    const facturasData = await leerExcel(
  "/datos/FacturaResumen.xlsx"
);

const proveedoresData = await leerExcel(
  "/datos/Proveedor.xlsx"
);

const facturasCompletas =
  facturasData.map((f) => {

    const proveedor =
      proveedoresData.find(
        (p) =>
          p.ID_Proveedor ==
          f.ID_Proveedor
      );

    return {
      ...f,
      ProveedorNombre:
        proveedor?.RazonSocial ||
        "Proveedor no encontrado",
    };
  });

setFacturas(
  facturasCompletas
);

    setFacturas(datos);
  };

  const facturasFiltradas =
    estatus === "Todas"
      ? facturas
      : facturas.filter(
          f => f.EstatusFactura === estatus
        );

  return (
    <div>

      <h1>Facturas</h1>

      <select
        value={estatus}
        onChange={(e) =>
          setEstatus(e.target.value)
        }
      >
        <option>Todas</option>
        <option>Pagada</option>
        <option>Pendiente</option>
        <option>Vencida</option>
        <option>En revisión</option>
      </select>

      <p>
        Facturas encontradas:
        {facturasFiltradas.length}
      </p>

      <table
        border="1"
        cellPadding="8"
      >
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
          {facturasFiltradas.map(
            (f, index) => (
              <tr key={index}>
                <td>
                  {f.NumeroFactura}
                </td>

                <td>
                {f.ProveedorNombre}
                </td>

             <td>
                {new Date(
                 (f.FechaFactura - 25569)
                 * 86400
                * 1000
                 ).toLocaleDateString()}
            </td>

                <td>
                  $
                  {Number(
                    f.MontoTotal
                  ).toLocaleString()}
                </td>

                <td>
                  {f.EstatusFactura}
                </td>
              </tr>
            )
          )}
        </tbody>

      </table>

    </div>
  );
}