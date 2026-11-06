const iconPaths = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </>
  ),
  inventory: (
    <>
      <path d="M4 20V9l8-5 8 5v11H4Z" />
      <path d="M9 20v-6h6v6M4 9l8 5 8-5" />
    </>
  ),
  peticiones: (
    <>
      <path d="M8 3h7l4 4v14H5V3h3" />
      <path d="M14 3v5h5M8 13h8M8 17h8" />
    </>
  ),
  pedidos: (
    <>
      <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.5L21 8H6" />
      <circle cx="10" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </>
  ),
  facturas: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  chat: (
    <>
      <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.5-.8L4 20l1.8-4.2A7.5 7.5 0 1 1 20 11.5Z" />
      <path d="M9 12h.01M12.5 12h.01M16 12h.01" />
    </>
  ),
};

const roleLabels = {
  Dueño: "Administración",
  Gerencia: "Gerencia",
  Vendedor: "Ventas",
  Bodega: "Bodega",
  CtasXPagar: "Cuentas por pagar",
};

export default function Navbar({
  usuario,
  pantalla,
  setPantalla,
  cerrarSesion,
}) {
  const esAdministrativo = ["Dueño", "Gerencia"].includes(usuario.rol);
  const opciones = [
    ...(esAdministrativo
      ? [{ id: "dashboard", label: "Dashboard" }]
      : []),
    ...(usuario.rol === "Bodega"
      ? [{ id: "inventario", label: "Inventario", icon: "inventory" }]
      : []),
    ...(esAdministrativo || usuario.rol === "Bodega"
      ? [{ id: "peticiones", label: "Peticiones de compra" }]
      : []),
    ...(esAdministrativo || usuario.rol === "Vendedor"
      ? [{ id: "pedidos", label: "Pedidos" }]
      : []),
    ...(esAdministrativo || usuario.rol === "CtasXPagar"
      ? [{ id: "facturas", label: "Facturas" }]
      : []),
    { id: "chat", label: "Asistente IA" },
  ];
  const iniciales = usuario.nombre.slice(0, 2);

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">RC</div>
        <div className="brand-copy">
          <strong>Río Claro</strong>
          <span>Distribuidora · Portal</span>
        </div>
      </div>

      <div className="nav-label">Menú principal</div>
      <nav aria-label="Navegación principal">
        <ul className="nav-list">
          {opciones.map((opcion) => (
            <li key={opcion.id}>
              <button
                type="button"
                className={`nav-link${pantalla === opcion.id ? " active" : ""}`}
                aria-current={pantalla === opcion.id ? "page" : undefined}
                onClick={() => setPantalla(opcion.id)}
              >
                <span className="nav-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    {iconPaths[opcion.icon || opcion.id]}
                  </svg>
                </span>
                {opcion.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-user">
        <div className="avatar" aria-hidden="true">{iniciales}</div>
        <div className="user-copy">
          <strong>{usuario.nombre}</strong>
          <span>{roleLabels[usuario.rol] || usuario.rol}</span>
        </div>
        <button
          type="button"
          className="logout-button"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          onClick={cerrarSesion}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 17l5-5-5-5M15 12H3M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
          </svg>
        </button>
      </div>

      <div className="mobile-userbar">
        <span className="avatar" aria-hidden="true">{iniciales}</span>
        <span className="user-copy">
          <strong>{usuario.nombre}</strong>
          <span>{roleLabels[usuario.rol] || usuario.rol}</span>
        </span>
        <button type="button" className="button-primary" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
