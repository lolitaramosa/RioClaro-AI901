import { useState } from "react";

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const usuarios = {
    admin: "Dueño",
    gerencia: "Gerencia",
    vendedor: "Vendedor",
    bodega: "Bodega",
    ctasxpagar: "CtasXPagar",
  };

  const ingresar = (event) => {
    event.preventDefault();
    const nombreUsuario = usuario.trim().toLowerCase();

    if (password !== "Azure123*") {
      setError("La contraseña no es correcta. Inténtalo de nuevo.");
      return;
    }

    const rol = usuarios[nombreUsuario];
    if (!rol) {
      setError("No encontramos ese usuario. Verifica e inténtalo de nuevo.");
      return;
    }

    setError("");
    onLogin({ nombre: nombreUsuario, rol });
  };

  return (
    <main className="login-page">
      <section className="login-brand-panel" aria-label="Distribuidora Río Claro">
        <div className="login-brand">
          <div className="brand-mark" aria-hidden="true">RC</div>
          <div className="brand-copy">
            <strong>Río Claro</strong>
            <span>Distribuidora · Portal</span>
          </div>
        </div>

        <div className="login-message">
          <div className="eyebrow">Una operación más clara</div>
          <h1>Todo tu negocio, en un solo lugar.</h1>
          <p>
            Consulta pedidos, inventario y facturas desde una experiencia
            sencilla, segura y diseñada para tu equipo.
          </p>
        </div>

        <div className="login-footer">© Río Claro · Portal interno</div>
      </section>

      <section className="login-form-panel">
        <form className="login-form" onSubmit={ingresar}>
          <div className="eyebrow">Bienvenido de nuevo</div>
          <h2>Iniciar sesión</h2>
          <p>Ingresa tus datos para acceder al portal.</p>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <div className="field">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              name="username"
              autoComplete="username"
              placeholder="Escribe tu usuario"
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              aria-invalid={Boolean(error)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Escribe tu contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(error)}
            />
          </div>

          <button className="button-primary login-submit" type="submit">
            Entrar al portal
          </button>

          <div className="demo-access">
            <strong>Credenciales de demostración</strong>
            <span>Usuarios disponibles:</span>
            <ul>
              {Object.keys(usuarios).map((nombre) => (
                <li key={nombre}>
                  <code>{nombre}</code>
                </li>
              ))}
            </ul>
            <span>
              Contraseña para todos: <code>Azure123*</code>
            </span>
          </div>
        </form>
      </section>
    </main>
  );
}
