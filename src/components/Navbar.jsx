export default function Navbar({ usuario }) {
  return (
    <div
      style={{
        width: "220px",
        minHeight: "100vh",
        backgroundColor: "#1e293b",
        color: "white",
        padding: "20px",
      }}
    >
      <h2>Río Claro</h2>

      <hr />

      <p>{usuario.rol}</p>
      <p>{usuario.nombre}</p>

      <ul style={{ listStyle: "none", padding: 0 }}>
       <li style={{marginBottom:"15px"}}>📊 Dashboard</li>
       <li style={{marginBottom:"15px"}}>📦 Inventario</li>
       <li style={{marginBottom:"15px"}}>🛒 Pedidos</li>
       <li style={{marginBottom:"15px"}}>📄 Facturas</li>
       <li style={{marginBottom:"15px"}}>🤖 Chat IA</li>
      </ul>
       </div>
  );
}