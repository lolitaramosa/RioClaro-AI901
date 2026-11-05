import { useEffect, useState } from "react";
import { leerExcel } from "../data/excelReader";

export default function Facturas() {

  const [facturas, setFacturas] = useState([]);
  const [estatus, setEstatus] = useState("Todas");

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {

    const datos = await leerExcel(
      "/datos/FacturaResumen.xlsx"
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
                  {f.ID_Proveedor}
                </td>

                <td>
                  {String(
                    f.FechaFactura
                  )}
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