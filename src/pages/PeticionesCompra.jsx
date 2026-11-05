import { useEffect, useState } from "react";
import { leerExcel } from "../data/excelReader";
 
export default function PeticionesCompra() {
 
const [peticiones, setPeticiones] = useState([]);
const [estatus, setEstatus] = useState("Todas");
 
useEffect(() => {
cargarPeticiones();
}, []);
 
const cargarPeticiones = async () => {
 
const peticionesData = await leerExcel(
"/datos/PeticionCompra.xlsx"
);
 
const productosData = await leerExcel(
"/datos/Producto.xlsx"
);
//console.log("PETICIONES");
//console.log(peticionesData[0]);

//console.log("PRODUCTOS");
//console.log(productosData[0]);
 
const sucursalesData = await leerExcel(
"/datos/Sucursal.xlsx"
);
 
const peticionesCompletas =
peticionesData.map((p) => {
 
const producto =
productosData.find(
(prod) =>
prod.ID_Producto ==
p[" ID_producto"]
);
 
const sucursal =
sucursalesData.find(
(s) =>
s["ID_sucursal "] ==
p.ID_sucursal
);
 
return {
...p,
 
ProductoNombre:
producto?.NombreProducto ||
"Producto no encontrado",
 
SucursalNombre:
sucursal?.nombre_sucursal ||
"Sucursal no encontrada",
};
});
 
setPeticiones(
peticionesCompletas
);
};
 
const peticionesFiltradas =
estatus === "Todas"
? peticiones
: peticiones.filter(
(p) =>
p["estatus "] === estatus
);
 
return (
<div>
 
<h1>
Peticiones de Compra
</h1>
 
<select
value={estatus}
onChange={(e) =>
setEstatus(e.target.value)
}
>
<option>Todas</option>
<option>Registrado</option>
<option>Aprobado</option>
</select>
 
<p>
Peticiones encontradas:
{" "}
{peticionesFiltradas.length}
</p>
 
<table
border="1"
cellPadding="8"
>
<thead>
<tr>
<th>ID Compra</th>
<th>Producto</th>
<th>Sucursal</th>
<th>Cantidad</th>
<th>Fecha</th>
<th>Estatus</th>
</tr>
</thead>
 
<tbody>
 
{peticionesFiltradas.map(
(p, index) => (
 
<tr key={index}>
 
<td>
{p.ID_compra}
</td>
 
<td>
{p.ProductoNombre}
</td>
 
<td>
{p.SucursalNombre}
</td>
 
<td>
{p.cantidad_solicitada}
</td>
 
<td>
  {new Date(
    (p.fecha_peticion - 25569)
      * 86400
      * 1000
  ).toLocaleDateString()}
</td>
 
<td>
{p["estatus "]}
</td>
 
</tr>
 
)
)}
 
</tbody>
 
</table>
 
</div>
);
}
 
