# Portal Río Claro

Portal de demostración desarrollado con React y Vite para consultar pedidos, inventario, facturas y el agente de Microsoft Foundry.

## Ejecutar la aplicación

1. Inicia sesión en Azure con una cuenta que tenga acceso al proyecto y al agente:

   ```powershell
   az login
   ```

2. En una terminal, inicia la Azure Function que conecta con Foundry:

   ```powershell
   cd AgentFunction
   npm install
   npm start
   ```

   La Function se ejecuta en `http://localhost:7071`. Para almacenamiento local, `AzureWebJobsStorage` usa Azurite; inicia Azurite si Core Tools lo solicita.

3. En otra terminal, desde la raíz del repositorio, inicia la interfaz:

   ```powershell
   npm install
   npm run dev
   ```

   Vite envía `/api/chat` a la Function local. La interfaz nunca recibe las credenciales de Azure.

## Configuración de Microsoft Foundry

La Function utiliza estos valores por defecto:

- `AI_PROJECT_ENDPOINT`: `https://rioclaro-ai901-dra-resource.services.ai.azure.com/api/projects/RioClaro-AI901-DRA`
- `AI_AGENT_NAME`: `Asistente-RioClaro`

Puedes sobrescribirlos en `AgentFunction/local.settings.json` bajo `Values` para desarrollo local o configurarlos como *Application settings* de la Function App en Azure. No guardes tokens ni claves en el frontend.

En local, la Function usa `DefaultAzureCredential` y puede autenticarse con Azure CLI. En Azure, usa la identidad administrada de la Function App; habilítala y asígnale el rol de proyecto de Foundry que permita ejecutar el agente. El endpoint de protocolo OpenAI de agentes alojados requiere la opción preview del SDK instalada; el SDK instalado etiqueta esta capacidad como preview, así que confirma su disponibilidad antes de usarla en producción.

Para publicar el frontend por separado, configura `VITE_CHAT_API_URL` con la URL pública de la ruta `/api/chat` de la Function App. Configura también CORS en la Function App para permitir únicamente el origen publicado del frontend. `.env.example` contiene un ejemplo de esta variable.

> La Function expone una ruta anónima para simplificar esta aplicación de demostración. CORS no autentica llamadas ni evita el uso externo de la ruta; antes de utilizarla en producción, agrega autenticación, controles de abuso y límites de consumo.
