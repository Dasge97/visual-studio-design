# Persistencia, versiones y conflictos

PostgreSQL almacena documentos en JSONB y metadatos relacionales. [persistence.sql](../contracts/persistence.sql) propone la primera migración. Archivos en volumen persistente, identificados por UUID y hash SHA-256; no guardar rutas del cliente como rutas del servidor.

## Entidades

projects (brief/tipo), workspaces (current o alternative con documento/revision), snapshots (documento + decisiones inmutables), decisions (registro vigente), assets (metadata/ubicación), design_actions (comandos y before/after), jobs (agente/export), job_events (SSE), agent_sessions, exports, owner_sessions.

Cada proyecto tiene exactamente un workspace current creado en la misma transacción que project. Alternativas son workspaces con copia completa y base_snapshot_id. Copiar es deliberado en MVP; no event sourcing ni diffs como único mecanismo de reconstrucción. Snapshots incluyen decisiones en ese momento. Assets son inmutables y no se borran físicamente mientras estén referenciados por snapshots o exports.

## Mutación atómica

1. Autenticar actor y ámbito; actor se deriva de credencial, nunca del body.
2. Buscar requestId ya aplicado. Mismo ID+mismo hash devuelve resultado anterior; mismo ID+body distinto es 409.
3. Bloquear workspace FOR UPDATE, comprobar expectedRevision.
4. Aplicar a copia; validar estructura y cierre de dependencias; comprobar permisos sobre aprobaciones/otras pantallas.
5. Guardar documento revision+1, acción con before/after y cambios de decisiones en la misma transacción.
6. Commit y emitir evento. Un fallo no cambia nada.

Revisiones son por workspace, no globales. Aprobación y restauración también avanzan revisión para que una tarea antigua no ignore decisiones nuevas. Lock de decisión y workspace en orden fijo para evitar deadlocks. Concurrencia del worker no sustituye el control optimista.

## Guardado y undo

Preview optimista en navegador; enviar comando al terminar gesto o confirmar campo. Serializar comandos de un mismo cliente; actualizar expectedRevision tras cada respuesta. No agrupar múltiples intenciones en un solo autosave indefinido. Undo MVP revierte la última acción reversible de ese workspace si sigue siendo head; redo solo si no hubo nueva acción. Usa un nuevo comando y revisión, no decrementa revision. Acciones revertidas conservan auditoría. Para volver más atrás usar snapshot, evitando borrar cambios intercalados de otra pestaña.

## Snapshots y alternativas

Crear snapshot al aprobar decisión, aplicar alternativa, restaurar o guardar versión manual. Capturar before y after al aplicar alternativa. Restaurar crea nueva revisión con documento y decisiones del snapshot, sin eliminar snapshots posteriores. Las decisiones restauradas reflejan ese diseño; el evento de restauración queda registrado.

Crear alternativa captura snapshot base y duplica documento. Aplicar alternativa requiere que current siga en la revisión base conocida; si no, 409 y conservar ambas. MVP ofrece recrear alternativa desde current y reaplicar cambios revisados, o restaurar explícitamente snapshot; no rebase automático silencioso.

Combinar crea tercera alternativa. Reusar dependencia con mismo ID+contenido; contenido distinto exige elegir o duplicar remapeando todas las referencias. Validar el resultado antes de permitir aplicar.

## Desconexiones y reinicios

No afirmar guardado hasta respuesta. Timeout de cliente puede esconder un commit exitoso: reintentar con mismo requestId. Si cambia revisión en otra pestaña, preservar pending local y ofrecer convertirlo en alternativa. No último escritor gana.

Al reiniciar worker: trabajos running con lease expirado → interrupted, nunca repetir mutaciones a ciegas. Aplicadas son idempotentes y durables. Cancelación impide nuevas mutaciones y detiene proceso; acciones ya confirmadas se conservan y son visibles/deshacibles.

## Retención

MVP no purga historial automáticamente. Archivar proyectos de forma reversible. Límites visibles de espacio; limpieza física posterior con grafo de referencias. No borrar recursos usados por exports históricos. Backups de BD y volumen coordinados: ver operación.
