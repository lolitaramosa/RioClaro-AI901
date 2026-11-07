const { app } = require("@azure/functions");
const { AIProjectClient } = require("@azure/ai-projects");
const {
    DefaultAzureCredential,
    ManagedIdentityCredential
} = require("@azure/identity");

const projectEndpoint = process.env.AI_PROJECT_ENDPOINT ||
    "https://rioclaro-ai901-dra-resource.services.ai.azure.com/api/projects/RioClaro-AI901-DRA";
const agentName = process.env.AI_AGENT_NAME || "Asistente-RioClaro";
const maxQuestionLength = 4000;
const maxResponseIdLength = 256;
const roleNames = {
    Dueño: "DUEÑO",
    Gerencia: "GERENCIA",
    Vendedor: "VENDEDOR",
    Bodega: "ALMACÉN",
    CtasXPagar: "CUENTAS POR PAGAR"
};

const credential = process.env.AZURE_FUNCTIONS_ENVIRONMENT === "Development"
    ? new DefaultAzureCredential()
    : new ManagedIdentityCredential();

const projectClient = new AIProjectClient(
    projectEndpoint,
    credential,
    { allowPreview: true }
);

const openAIClient = projectClient.getOpenAIClient({
    azureConfig: {
        allowPreview: true,
        agentName
    }
});

app.http("chat-agent", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "chat",
    handler: async (request, context) => {
        let body;
        try {
            body = await request.json();
        } catch {
            return {
                status: 400,
                jsonBody: { error: "El cuerpo de la solicitud debe ser JSON válido." }
            };
        }

        const pregunta = typeof body?.pregunta === "string"
            ? body.pregunta.trim()
            : "";
        if (!pregunta || pregunta.length > maxQuestionLength) {
            return {
                status: 400,
                jsonBody: {
                    error: `La pregunta debe tener entre 1 y ${maxQuestionLength} caracteres.`
                }
            };
        }

        const rol = body?.rol;
        if (typeof rol !== "string" || !Object.prototype.hasOwnProperty.call(roleNames, rol)) {
            return {
                status: 400,
                jsonBody: { error: "El rol de usuario no es válido." }
            };
        }

        const previousResponseId = body?.previousResponseId;
        if (
            previousResponseId !== undefined &&
            (typeof previousResponseId !== "string" ||
                previousResponseId.length > maxResponseIdLength ||
                !/^[A-Za-z0-9_-]+$/.test(previousResponseId))
        ) {
            return {
                status: 400,
                jsonBody: { error: "El identificador de conversación no es válido." }
            };
        }

        try {
            const response = await openAIClient.responses.create({
                input: [
                    {
                        type: "message",
                        role: "developer",
                        content: `Contexto de sesión de la aplicación: el rol del usuario actual es ${roleNames[rol]}. Usa este rol para adaptar la respuesta según tus instrucciones y no preguntes al usuario cuál es su rol.`
                    },
                    {
                        type: "message",
                        role: "user",
                        content: pregunta
                    }
                ],
                ...(previousResponseId
                    ? { previous_response_id: previousResponseId }
                    : {})
            });

            if (typeof response.output_text !== "string" || !response.output_text.trim()) {
                context.error("Foundry devolvió una respuesta sin texto.");
                return {
                    status: 502,
                    jsonBody: { error: "El asistente no devolvió una respuesta de texto." }
                };
            }

            return {
                status: 200,
                jsonBody: {
                    respuesta: response.output_text.trim(),
                    responseId: response.id
                }
            };
        } catch (error) {
            context.error("No se pudo completar la solicitud al agente de Foundry.", error);
            return {
                status: 502,
                jsonBody: { error: "No fue posible obtener una respuesta del asistente." }
            };
        }
    }
});
