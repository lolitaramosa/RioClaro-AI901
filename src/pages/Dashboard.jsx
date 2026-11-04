import Navbar from "../components/Navbar";
import Inventario from "./Inventario";

export default function Dashboard({ usuario }) {
  return (
    <div style={{ display: "flex" }}>
      <Navbar usuario={usuario} />

      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        <Inventario />
      </div>
    </div>
  );
}
