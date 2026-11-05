import { useState } from "react";

export default function ChatIA() {

  const [pregunta, setPregunta] =
    useState("");

  const [respuesta, setRespuesta] =
    useState("");

  const enviarPregunta = async () => {

  if (!pregunta) return;

  try {

    setRespuesta("Consultando IA...");

    const response = await fetch(
      "https://rioclaro-chat-dra-api-c7bug9bwbxe7azh4.mexicocentral-01.azurewebsites.net/api/chat",
        {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          pregunta
        })
      }
    );
   const data =
      await response.json();

    setRespuesta(
      data.respuesta
    );

  } catch (error) {

    setRespuesta(
      "Error al consultar Azure OpenAI"
    );

  }
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
    backgroundColor: "#f8fafc",
    border: "1px solid #cbd5e1",
    padding: "15px",
    borderRadius: "10px",
    minHeight: "80px"
  }}
>
  {respuesta}
</div>

    </div>
  );
}