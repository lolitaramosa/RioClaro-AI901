import { useEffect, useState } from "react";
import { leerExcel } from "../data/excelReader";

export default function Pedidos() {

  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {

    const pedidosData = await leerExcel(
      "/datos/Pedido.xlsx"
    );

    const clientesData = await leerExcel(
      "/datos/Cliente.xlsx"
    );

    const sucursalesData = await leerExcel(
      "/datos/Sucursal.xlsx"
    );

    const pedidosCompletos =
      pedidosData.map((p) => {

        const cliente =
          clientesData.find(
            (c) =>
              c.ID_Cliente ==
              p.ID_Cliente
          );

        const sucursal =
          sucursalesData.find(
            (s) =>
              s["ID_sucursal "] ==
              p.ID_Sucursal
          );

        return {
          ...p,

          ClienteNombre:
            cliente?.RazonSocial ||
            "Cliente no encontrado",

          SucursalNombre:
            sucursal?.nombre_sucursal ||
            "Sucursal no encontrada",
        };
      });

    setPedidos(
      pedidosCompletos
    );
  };

  return (
    <div>

      <h1>Pedidos</h1>

      <p>
        Pedidos encontrados:
        {pedidos.length}
      </p>

      <table
        border="1"
        cellPadding="8"
      >
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Cliente</th>
            <th>Sucursal</th>
            <th>Monto</th>
            <th>Estatus</th>
          </tr>
        </thead>

        <tbody>

          {pedidos.map(
            (p, index) => (

              <tr key={index}>

                <td>
                  {p.ID_Pedido}
                </td>

                <td>
                  {p.ClienteNombre}
                </td>

                <td>
                  {p.SucursalNombre}
                </td>

                <td>
                  $
                  {Number(
                    p.MontoTotal
                  ).toLocaleString()}
                </td>

                <td>
                  {p.Estatus}
                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}