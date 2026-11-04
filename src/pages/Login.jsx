import { useState } from "react";

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const usuarios = {
    admin: "Dueño",
    gerencia: "Gerencia",
    vendedor: "Vendedor",
    bodega: "Bodega",
    ctasxpagar: "CtasXPagar",
  };

  const ingresar = () => {
    if (password !== "Azure123*") {
      alert("Contraseña incorrecta");
      return;
    }

    const rol = usuarios[usuario];

    if (!rol) {
      alert("Usuario no válido");
      return;
    }

    onLogin({
      nombre: usuario,
      rol,
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          width: "350px",
          borderRadius: "12px",
        }}
      >
        <h2>Distribuidora Río Claro</h2>

        <input
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <button
          style={{
            width: "100%",
            padding: "10px",
            background: "#2563eb",
            color: "white",
            border: "none",
          }}
          onClick={ingresar}
        >
          Ingresar
        </button>

        <hr />

        <small>
          Usuarios:
          <br />
          admin
          <br />
          gerencia
          <br />
          vendedor
          <br />
          bodega
          <br />
          ctasxpagar
          <br />
          <br />
          Contraseña:
          <br />
          Azure123*
        </small>
      </div>
    </div>
  );
}