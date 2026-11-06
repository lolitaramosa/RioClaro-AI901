import { useState } from "react";

export default function ChatIA() {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const enviarPregunta = async (event) => {
    event.preventDefault();
    const texto = pregunta.trim();
    if (!texto || cargando) return;

    setCargando(true);
    setError("");
    setRespuesta("");

    try {
      const response = await fetch(
        "https://rioclaro-chat-dra-api-c7bug9bwbxe7azh4.mexicocentral-01.azurewebsites.net/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pregunta: texto }),
        },
      );

      if (!response.ok) {
        throw new Error(`La solicitud terminó con el estado ${response.status}.`);
      }

      const data = await response.json();
      if (typeof data.respuesta !== "string" || !data.respuesta.trim()) {
        throw new Error("La respuesta del servicio no tiene el formato esperado.");
      }

      setRespuesta(data.respuesta);
    } catch {
      setError("No pudimos consultar al asistente. Intenta de nuevo en unos momentos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="chat-card">
      <header className="chat-card-header">
        <div className="ai-mark" aria-hidden="true">IA</div>
        <div>
          <h1>Asistente inteligente Río Claro</h1>
          <p>Microsoft Foundry · GPT-4.1-mini</p>
        </div>
      </header>

      <div className="chat-body">
        <form onSubmit={enviarPregunta}>
          <label className="chat-label" htmlFor="pregunta">
            ¿En qué te puedo ayudar?
          </label>
          <textarea
            id="pregunta"
            className="chat-input"
            placeholder="Escribe tu pregunta sobre la operación de Río Claro…"
            value={pregunta}
            onChange={(event) => setPregunta(event.target.value)}
            disabled={cargando}
          />
          <div className="chat-actions">
            <button
              className="button-primary"
              type="submit"
              disabled={cargando || !pregunta.trim()}
            >
              {cargando ? "Consultando…" : "Consultar asistente"}
            </button>
          </div>
        </form>

        {error && <div className="error-state" role="alert">{error}</div>}

        <section className="chat-response" aria-live="polite">
          <h2>Respuesta</h2>
          <p>
            {cargando
              ? "El asistente está preparando una respuesta…"
              : respuesta || "Cuando envíes una pregunta, la respuesta aparecerá aquí."}
          </p>
        </section>
      </div>
    </section>
  );
}
