export default function Navbar({
  usuario,
  setPantalla
}) {
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

      <ul
        style={{
          listStyle: "none",
          padding: 0
        }}
      >
        <li
          style={{
            marginBottom: "15px",
            cursor: "pointer"
          }}
          onClick={() =>
            setPantalla("dashboard")
          }
        >
          📊 Dashboard
        </li>

        <li
          style={{
            marginBottom: "15px",
            cursor: "pointer"
          }}
          onClick={() =>
            setPantalla("inventario")
          }
        >
          📦 Inventario
        </li>

        <li
          style={{
            marginBottom: "15px",
            cursor: "pointer"
          }}
        >
         <li
  style={{
    marginBottom: "15px",
    cursor: "pointer"
  }}
  onClick={() =>
    setPantalla("pedidos")
  }
>
  🛒 Pedidos
</li>
        </li>

        <li
          style={{
            marginBottom: "15px",
            cursor: "pointer"
          }}
          onClick={() =>
            setPantalla("facturas")
          }
        >
          📄 Facturas
        </li>

        <li
          style={{
            marginBottom: "15px",
            cursor: "pointer"
          }}
        >
          🤖 Chat IA
        </li>
      </ul>
    </div>
  );
}