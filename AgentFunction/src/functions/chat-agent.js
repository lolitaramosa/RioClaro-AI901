const { app } = require("@azure/functions");

const {
    AIProjectClient
} = require("@azure/ai-projects");

const {
    DefaultAzureCredential
} = require("@azure/identity");

app.http("chat-agent", {
    methods: ["POST"],
    authLevel: "anonymous",

    handler: async (request, context) => {

        try {

            const body =
                await request.json();

            const pregunta =
                body?.pregunta || "Hola";

            const credential =
                new DefaultAzureCredential();

            const projectClient =
                new AIProjectClient(
                    "https://rioclaro-ai901-dra-resource.services.ai.azure.com/api/projects/RioClaro-AI901-DRA",
                    credential,
                    {
                        allowPreview: true
                    }
                );

            const openAIClient =
                projectClient.getOpenAIClient(
                    "Asistente-RioClaro"
                );

            const respuesta =
                await openAIClient.responses.create({
                    model: "gpt-4.1-mini",
                    input: pregunta
                });

            return {
    status: 200,
    jsonBody: JSON.parse(
        JSON.stringify(respuesta)
    )
};

        } catch (error) {

            return {
                status: 200,
                jsonBody: {
                    error: error.message,
                    nombre: error.name,
                    detalle: error.toString()
                }
            };

        }

    }
});