import { useEffect, useState } from "react";
import { leerExcel } from "../data/excelReader";
 
export default function Inventario() {
const [datos, setDatos] = useState([]);
const [soloCriticos, setSoloCriticos] = useState(false);
const [error, setError] = useState("");
 
useEffect(() => {
cargarDatos();
}, []);
 
const cargarDatos = async () => {

  const existencias = await leerExcel(
    "/datos/ProductoExistencia.xlsx"
  );

  const productos = await leerExcel(
    "/datos/Producto.xlsx"
  );

  const sucursales = await leerExcel(
    "/datos/Sucursal.xlsx"
  );

  // LIMPIAR COLUMNAS DE SUCURSALES
  const sucursalesLimpias = sucursales.map(s => ({
    ID_sucursal: s["ID_sucursal "],
    nombre_sucursal: s.nombre_sucursal
  }));

  const datosCombinados = existencias.map((e) => {

    const producto = productos.find(
      (p) => p.ID_Producto == e.ID_producto
    );

    const sucursal = sucursalesLimpias.find(
      (s) => s.ID_sucursal == e["ID_sucursal "]
    );

    return {
      id: e.ID_producto_existencia,

      producto:
        producto?.NombreProducto || "No encontrado",

      sucursal:
        sucursal?.nombre_sucursal || "No encontrada",

      existencia: e.Existencia,
    };
  });

  setDatos(datosCombinados);
};
const datosFiltrados = soloCriticos
  ? datos.filter((d) => d.existencia <= 10)
  : datos; 

return (
<div>
<h2>Inventario</h2>
 
{error && (
<div style={{ color: "red" }}>
Error: {error}
</div>
)}
 
<p>
Registros encontrados: {datos.length}
</p>
<label>
  <input
    type="checkbox"
    checked={soloCriticos}
    onChange={() =>
      setSoloCriticos(!soloCriticos)
    }
  />
  {"Mostrar inventario crítico (<=10)"}
</label>
 
<table border="1" cellPadding="8">
<thead>
<tr>
<th>ID</th>
<th>Nombre Producto</th>
<th>Sucursal</th>
<th>Existencia</th>
</tr>
</thead>
 
<tbody>
  {datosFiltrados.map((item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.producto}</td>
      <td>{item.sucursal}</td>
      <td>{item.existencia}</td>
    </tr>
  ))}
</tbody>
</table>
</div>
);
}