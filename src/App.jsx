import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {

  const [usuario, setUsuario] =
    useState(null);

  return (
    <>
      {!usuario ? (

        <Login
          onLogin={setUsuario}
        />

      ) : (

        <Dashboard
          usuario={usuario}
          cerrarSesion={() =>
            setUsuario(null)
          }
        />

      )}
    </>
  );
}

export default App;