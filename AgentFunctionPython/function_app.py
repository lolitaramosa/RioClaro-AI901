import json
import azure.functions as func

from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

app = func.FunctionApp()


@app.route(
    route="ping",
    methods=["GET", "POST"],
    auth_level=func.AuthLevel.ANONYMOUS
)
def ping(req: func.HttpRequest) -> func.HttpResponse:

    return func.HttpResponse(
        "pong",
        status_code=200
    )


@app.route(
    route="chatagent2",
    methods=["POST"],
    auth_level=func.AuthLevel.ANONYMOUS
)
def chatagent2(req: func.HttpRequest) -> func.HttpResponse:

    try:

        credential = DefaultAzureCredential()

        project_client = AIProjectClient(
            endpoint=(
                "https://rioclaro-ai901-dra-resource.services.ai.azure.com"
                "/api/projects/RioClaro-AI901-DRA"
            ),
            credential=credential
        )

        resultado = {
            "agents_methods": dir(
                project_client.beta.agents
            )
        }

        return func.HttpResponse(
            json.dumps(
                resultado,
                default=str
            ),
            status_code=200,
            mimetype="application/json"
        )

    except Exception as ex:

        resultado = {
            "error": str(ex),
            "tipo": type(ex).__name__
        }

        return func.HttpResponse(
            json.dumps(resultado),
            status_code=500,
            mimetype="application/json"
        )