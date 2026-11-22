# API y operaciones

REST JSON bajo /api/v1; sesión propietaria y CSRF para navegador. Bridge usa credencial efímera ligada a job y proyecto en ruta interna no publicada. Nunca aceptar actorRole desde body. Respuestas con requestId y revisión. Tamaño de JSON inicial 2 MiB; uploads por ruta separada.

| Método / ruta | Resultado |
| --- | --- |
| POST /auth/login; POST /auth/logout; GET /auth/me | Sesión única de propietario, sin registro público |
| GET, POST /projects | Listar/crear |
| GET, PATCH /projects/:id | Brief y archivo reversible |
| GET /projects/:id/workspaces/:wid | Documento y revisión |
| POST /projects/:id/commands | Mutación atómica y deshacible |
| POST /projects/:id/alternatives | Copia desde revisión conocida |
| POST /projects/:id/alternatives/:wid/apply | Aplicar comprobando revisión base de current |
| POST /projects/:id/alternatives/combine | Crear tercera alternativa con selección/remapeo explícito |
| GET, POST /projects/:id/snapshots | Listar/crear punto manual |
| POST /projects/:id/snapshots/:sid/restore | Nueva revisión; no borra historial |
| GET, POST /projects/:id/decisions | Leer/crear cuestión |
| POST /projects/:id/decisions/:did/approve | Acción del propietario y snapshot |
| POST /projects/:id/decisions/:did/reopen | Reabrir decisión |
| POST /projects/:id/assets | Subir imagen validada |
| GET /projects/:id/assets/:aid | Recurso autenticado |
| POST /projects/:id/references/:aid/annotations | Rectángulo normalizado y nota |
| POST /projects/:id/agent/jobs | Encolar instrucción, ámbito y revisión |
| GET /projects/:id/jobs/:jid/events | SSE reanudable |
| POST /projects/:id/jobs/:jid/cancel | Revocar nuevas mutaciones y detener proceso |
| POST /projects/:id/grants | Autorizar propuesta concreta como propietario |
| POST /projects/:id/renders | Captura de revisión/escenario/viewport exactos |
| POST /projects/:id/exports | Trabajo exportación draft/approved/project |
| GET /projects/:id/exports/:eid/download | ZIP autorizado de versión inmutable |

Todos los endpoints mutadores que afectan al diseño usan expectedRevision y requestId, incluidos approve/restore/apply. GET de objetos comprueba pertenencia al proyecto en servidor. API devuelve 404 para IDs ajenos, sin revelar existencia.

## Envelope

```json
{
  "requestId": "request-demo-1",
  "projectId": "project-twin-hills-demo",
  "workspaceId": "workspace-current",
  "expectedRevision": 1,
  "operations": [
    {"type":"updateNode","nodeId":"money","changes":{"layout":{"offset":{"x":32,"y":24}}}}
  ]
}
```

changes usa merge profundo de objetos conocidos; arrays se reemplazan completos; null solo donde el esquema lo permite; campos desconocidos rechazados. IDs y tipo de nodo no se cambian con updateNode. Borrar propiedad opcional requiere unsetPaths explícito, con paths permitidos. No JSON Patch sin restricciones. Agregar campos/operaciones requiere actualizar contrato y tests.

## Operaciones iniciales

addNode(parentId,index,node), updateNode(nodeId,changes,unsetPaths), removeNode(nodeId), reparentNode(nodeId,parentId,index), reorderChildren(parentId,childIds), addScreen(screen), updateScreen(screenId,changes), removeScreen(screenId), upsertToken(token), removeToken(tokenId), createComponent(component,nodes), updateComponent(componentId,changes), createInstance(parentId,index,node), setInstanceOverride(instanceId,key,value), upsertVariable(variable), upsertScenario(scenario), upsertStateRule(rule), upsertInteraction(interaction), removeInteraction(interactionId).

removeNode incluye descendientes, pero devuelve DEPENDENCY_CONFLICT si existen referencias externas no eliminadas/remapeadas en el mismo comando. No borrar silenciosamente interacciones. removeScreen rechaza navegación entrante sin resolución. reorderChildren debe ser permutación exacta. reparent rechaza ciclos y adapta layout solo si operación incluye el nuevo layout explícito.

## Errores

400 VALIDATION_ERROR; 401 AUTH_REQUIRED; 403 SCOPE_DENIED; 404 NOT_FOUND; 409 REVISION_CONFLICT/IDEMPOTENCY_CONFLICT/DEPENDENCY_CONFLICT; 422 APPROVAL_REQUIRED/CONSTRAINT_VIOLATION; 429 RATE_LIMITED; 503 AGENT_UNAVAILABLE; 500 INTERNAL_ERROR con ID de diagnóstico sin secretos.

REVISION_CONFLICT devuelve currentRevision, no fuerza aplicación. APPROVAL_REQUIRED devuelve propuesta y alcance afectado para UI, no un permiso automáticamente concedido. Límites y errores son iguales para herramientas MCP y editor.
