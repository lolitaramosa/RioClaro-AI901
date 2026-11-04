import { useEffect, useState } from "react";
import { leerExcel } from "../data/excelReader";
import VentasPorSucursal
from "../components/VentasPorSucursal";
 
export default function DashboardEjecutivo() {
 
const [ventas, setVentas] = useState(0);
const [pedidos, setPedidos] = useState(0);
const [facturasPendientes, setFacturasPendientes] = useState(0);
const [productosCriticos, setProductosCriticos] = useState(0);
 
useEffect(() => {
cargarIndicadores();
}, []);
 
const cargarIndicadores = async () => {
 
const pedidosData = await leerExcel(
"/datos/Pedido.xlsx"
);
 
const facturasData = await leerExcel(
"/datos/FacturaResumen.xlsx"
);
 
const inventarioData = await leerExcel(
"/datos/ProductoExistencia.xlsx"
);
 
const ventasTotales = pedidosData.reduce(
(total, pedido) =>
total + Number(pedido.MontoTotal || 0),
0
);
 
const facturasNoPagadas = facturasData.filter(
(f) => f.EstatusFactura !== "Pagada"
).length;
 
const inventarioCritico = inventarioData.filter(
(i) => Number(i.Existencia) <= 10
).length;
 
setVentas(ventasTotales);
setPedidos(pedidosData.length);
setFacturasPendientes(facturasNoPagadas);
setProductosCriticos(inventarioCritico);
};
 
return (
<div>
 
<h1
  style={{
    fontSize: "52px",
    marginBottom: "25px"
  }}
>
  Dashboard Ejecutivo
</h1>
 
<div
style={{
display: "flex",
gap: "20px",
flexWrap: "wrap",
}}
>
 
<div
style={{
background: "#2563eb",
color: "white",
padding: "20px",
borderRadius: "10px",
width: "220px",
}}
>
<h3>Ventas Totales</h3>
<h2>
$
{ventas.toLocaleString()}
</h2>
</div>
 
<div
style={{
background: "#16a34a",
color: "white",
padding: "20px",
borderRadius: "10px",
width: "220px",
}}
>
<h3>Pedidos</h3>
<h2>{pedidos}</h2>
</div>
 
<div
style={{
background: "#dc2626",
color: "white",
padding: "20px",
borderRadius: "10px",
width: "220px",
}}
>
<h3>Facturas Pendientes</h3>
<h2>{facturasPendientes}</h2>
</div>
 
<>
<div
  style={{
    background: "#ea580c",
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "220px",
  }}
>
  <h3>Productos Críticos</h3>
  <h2>{productosCriticos}</h2>
</div>

  <div
    style={{
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
    }}
  >
    {/* KPI 1 */}
    {/* KPI 2 */}
    {/* KPI 3 */}
    {/* KPI 4 */}
  </div>

</>
 
</div>
  <VentasPorSucursal />
</div>
);
}