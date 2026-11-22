# Servicio Claude Code

## Elección confirmada

CLI oficial Claude Code con token generado por `claude setup-token`, inyectado solo al worker como CLAUDE_CODE_OAUTH_TOKEN. No pedir token en chat ni guardarlo en proyecto, git o exportaciones. No construir un proxy que reutilice el token como API de Anthropic.

Servicio worker de larga vida; procesos CLI por tarea con sesión reanudable por proyecto. Un proceso eternamente vivo no es necesario para preservar contexto. Mantener sessionId explícito y workspace privado por proyecto; no usar --continue global, que podría seleccionar otra conversación. El proyecto persistente sigue siendo fuente de verdad.

## Prueba obligatoria H0

En entorno de desarrollo con token del propietario: registrar claude --version; probar CLI no interactiva, --output-format stream-json, --verbose, --resume por ID, MCP local stdio, --tools restringidas y política de allowedTools. Verificar schema real de eventos de esa versión. No usar --bare, que no lee OAuth de suscripción. Fijar versión probada y documentar invocación exacta en docs/progress.md. La invocación orientativa es `claude -p --output-format stream-json --verbose ...`; no declararla probada en esta entrega.

Usar spawn con array de argumentos y shell:false, prompt por stdin, env mínimo y cwd propio. Cargar únicamente el MCP definido por la aplicación (strict config si soportado). Deshabilitar herramientas integradas de shell/edición y verificarlo con test negativo; preautorizar solo herramientas MCP permitidas. No emplear flags de omisión global de permisos. No montar repositorio del producto, Docker socket ni secretos del API dentro del workspace Claude.

Si la versión elegida no permite el allowlist requerido, bloquear mutaciones del agente y corregir integración; nunca compensar con un prompt. El editor manual puede continuar.

## Contexto

Enviar brief, proyecto/workspace/revision, pantalla/selección, viewport/escenario, decisión activa, restricciones, capacidades disponibles y resumen reciente. Leer detalles por herramientas. Sesión recuperada debe consultar revisión vigente al empezar. No depender de recuperar toda la conversación para saber el estado aprobado.

Prompt de rol: diseñador colaborador; propone alternativas comprensibles; explica tradeoffs brevemente; detecta incoherencias; no halaga todas las elecciones; consulta lo descartado; no amplía alcance ni se autoaprueba; materializa decisiones visuales en alternativas renderizadas; distingue imagen de referencia de diseño editable.

## Contrato MCP

Todas las herramientas reciben projectId ligado al job; el bridge rechaza otro proyecto. Herramientas mutadoras reciben workspaceId, expectedRevision y requestId. Retorno común: ok, data, revision, warnings; error con code, path, message y recovery. Errores de dominio no implican reintento ciego.

| Herramienta | Entrada adicional | Salida |
| --- | --- | --- |
| consultar_proyecto | include: summary/decisions/screens | Resumen, revisiones, decisiones y restricciones |
| inspeccionar_elementos | nodeIds o screenId | Nodos, dependencias, estilos resueltos y alcance |
| ver_diseno | workspaceId, revision, screenId, viewportId, scenarioId, fidelity | Imagen MCP y hash de render de esa revisión |
| consultar_referencias | assetIds, annotationIds opcionales | Imágenes y anotaciones autorizadas |
| crear_alternativa | sourceWorkspaceId, expectedRevision, title, scope | Workspace alternativo y revisión inicial |
| modificar_diseno | Envelope de comandos | Revisión, elementos afectados y decisiones a revisar |
| configurar_interaccion | Mismo envelope con operaciones de comportamiento | Validación y revisión |
| comprobar_diseno | workspaceId, revision, viewports/scenarios | Diagnósticos estructurales, overflow y contraste medible |
| presentar_propuesta | alternativeIds, decisionId, explicación, request de alcance opcional | Tarjeta persistida en UI, estado awaiting-user |

No exponer approveDecision, restoreSnapshot, gestionar secretos o borrar proyecto al agente. Comprobar diseño no certifica calidad artística ni accesibilidad completa.

## Permisos funcionales

Modo explore por defecto: escribe solo alternativas. Modo edit: instrucción directa del usuario autoriza operaciones dentro del scope del job; nuevos elementos deben quedar dentro de ese scope. Una petición «reduce este panel» permite ajustar ese panel y sus hijos, no estilos globales.

Scopes: pantalla y nodeIds con descendientes; propagación a instancias/componentes/tokens se calcula en servidor. Cruce con otras pantallas o decisiones aprobadas devuelve APPROVAL_REQUIRED con diff concreto. Usuario puede autorizar esa propuesta mediante UI; el backend crea grant de una sola aplicación con hash de comando, revisión, scope y expiración. Grant no puede reutilizarse con otro body. Tras cambios, aprobación anterior queda needs-review hasta reaprobar; autorizar una modificación no equivale a aprobar el resultado.

## Trabajos y recuperación

Estados queued/running/awaiting-user/completed/cancelled/failed/interrupted. Lease 30 s, heartbeat 10 s; tiempo máximo inicial 5 minutos configurable. cancelRequested revoca bridge y termina grupo de proceso (TERM, luego KILL con timeout). Job cancelado no puede modificar aunque llegue salida tardía.

Reconexión SSE con cursor persistente. Guardar eventos normalizados: status, assistant-message, tool-summary, proposal-ready, revision-changed, error, completed. No exponer stdout crudo ni secretos. Si token caduca: error AUTH_REQUIRED, conservar trabajo, instrucciones para renovar por canal administrativo. Si límite de uso: error RATE_LIMITED visible, sin reintentos infinitos. Reanudar sesión si existe y corresponde al proyecto; si no, crear sesión nueva y cargar contexto persistente.

## Aceptación específica

Claude ve capturas además de datos; genera dos variantes editables; no puede modificar otro proyecto; no puede aprobar; comando repetido no duplica cambios; una decisión protegida detiene mutación hasta autorización; cancelación corta herramientas; reinicio conserva proyecto. Prueba real con credencial debe quedar registrada, no sustituida por mocks.
