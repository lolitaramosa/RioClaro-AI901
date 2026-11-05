import { useState } from "react";

export default function ChatIA() {

  const [pregunta, setPregunta] =
    useState("");

  const [respuesta, setRespuesta] =
    useState("");

  const enviarPregunta = () => {

    if (!pregunta) return;

    setRespuesta(
      "El asistente Río Claro está configurado en Azure AI Foundry con GPT-4.1-mini. La integración mediante API será la siguiente fase del proyecto."
    );
  };

  return (
    <div>

      <h1>
        Asistente Inteligente Río Claro
      </h1>

      <p>
        Plataforma:
        Microsoft Foundry
      </p>

      <p>
        Modelo:
        GPT‑4.1‑mini
      </p>

      <hr />

      <textarea
        rows="5"
        style={{
          width: "100%"
        }}
        placeholder="Escribe una pregunta..."
        value={pregunta}
        onChange={(e) =>
          setPregunta(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <button
        onClick={enviarPregunta}
      >
        Consultar IA
      </button>

      <hr />

      <h3>Respuesta</h3>

      <div
        style={{
          border: "1px solid lightgray",
          padding: "15px",
          borderRadius: "10px"
        }}
      >
        {respuesta}
      </div>

    </div>
  );
}