export default function Navbar({
  usuario,
  setPantalla
}) {

  const esAdministrativo =
    usuario.rol === "Dueño" ||
    usuario.rol === "Gerencia";

  const esBodega =
    usuario.rol === "Bodega";

  const esVendedor =
    usuario.rol === "Vendedor";

  const esFacturas =
    usuario.rol === "CtasXPagar";

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
          padding: 0,
        }}
      >

        {esAdministrativo && (
          <li
            style={{
              marginBottom: "15px",
              cursor: "pointer",
            }}
            onClick={() =>
              setPantalla("dashboard")
            }
          >
            📊 Dashboard
          </li>
        )}

{
  (esAdministrativo ||
    esBodega) && (
    <li
      style={{
        marginBottom: "15px",
        cursor: "pointer",
      }}
      onClick={() =>
        setPantalla("peticiones")
      }
    >
      📋 Peticiones Compra
    </li>
  )
}

        {(esAdministrativo ||
          esVendedor) && (
          <li
            style={{
              marginBottom: "15px",
              cursor: "pointer",
            }}
            onClick={() =>
              setPantalla("pedidos")
            }
          >
            🛒 Pedidos
          </li>
        )}

        {(esAdministrativo ||
          esFacturas) && (
          <li
            style={{
              marginBottom: "15px",
              cursor: "pointer",
            }}
            onClick={() =>
              setPantalla("facturas")
            }
          >
            📄 Facturas
          </li>
        )}

        <li
          style={{
            marginBottom: "15px",
            cursor: "pointer",
          }}
          onClick={() =>
            setPantalla("chat")
          }
        >
          🤖 Chat IA
        </li>

      </ul>
    </div>
  );
}