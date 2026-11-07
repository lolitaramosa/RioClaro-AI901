import { useState } from "react";

export default function ChatIA({ usuario }) {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [responseId, setResponseId] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const chatEndpoint = import.meta.env.VITE_CHAT_API_URL || "/api/chat";

  const enviarPregunta = async (event) => {
    event.preventDefault();
    const texto = pregunta.trim();
    if (!texto || cargando) return;

    setCargando(true);
    setError("");
    setRespuesta("");

    try {
      const response = await fetch(chatEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pregunta: texto,
          rol: usuario.rol,
          ...(responseId ? { previousResponseId: responseId } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `La solicitud terminó con el estado ${response.status}.`);
      }

      if (typeof data.respuesta !== "string" || !data.respuesta.trim()) {
        throw new Error("La respuesta del servicio no tiene el formato esperado.");
      }

      setRespuesta(data.respuesta);
      setResponseId(typeof data.responseId === "string" ? data.responseId : "");
      setPregunta("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No pudimos consultar al asistente. Intenta de nuevo en unos momentos.",
      );
    } finally {
      setCargando(false);
    }
  };

  const iniciarNuevaConversacion = () => {
    setPregunta("");
    setRespuesta("");
    setResponseId("");
    setError("");
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
          <div className="chat-response-heading">
            <h2>Respuesta</h2>
            {responseId && (
              <button
                className="button-secondary"
                type="button"
                onClick={iniciarNuevaConversacion}
                disabled={cargando}
              >
                Nueva conversación
              </button>
            )}
          </div>
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
