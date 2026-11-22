# Operación y despliegue

Arquitectura prevista; los contenedores y comandos de arranque se crean en H0/H7. No hay servidor configurado en esta entrega.

## Acceso

Un propietario provisionado mediante comando administrativo local, sin registro público ni roles. Contraseña con hash Argon2id; sesión aleatoria persistida como hash en BD; cookie HttpOnly/Secure/SameSite=Lax; CSRF en mutaciones y verificación Origin. Rate limit login. HTTPS por proxy existente del servidor, app y worker en redes internas. API y recursos no son públicos por conocer una URL.

## Secretos y archivos

Variables: DATABASE_URL para API; SESSION_SECRET; APP_ORIGIN; DATA_DIR. Worker: CLAUDE_CODE_OAUTH_TOKEN, CLAUDE_BIN, CLAUDE_MODEL, ruta de configuración/sesiones propia e INTERNAL_API_URL. Credenciales de bridge efímeras por job; el token Claude nunca se transmite al navegador. Leer .env.example, copiar fuera de git e inyectar por secrets/env del servidor. No rellenar secretos durante generación de docs.

Worker bajo usuario sin privilegios, sin acceso al socket Docker, sin volumen del código fuente ni credenciales de postgres. Workspace por proyecto y configuración CLI controlada; no cargar hooks/plugins del usuario de sistema. Permitir red saliente necesaria a Claude; herramientas del diseño solo al API interno. API normaliza y valida uploads; no descarga URLs arbitrarias recibidas del agente.

## Procesos

Docker Compose: app, agent-worker, postgres. Volúmenes: postgres-data, design-assets, claude-state. Datos de usuario en servidor, no dentro de imágenes. Health endpoints separan readiness de BD y disponibilidad Claude. Claude caído deshabilita asistencia, no edición/exportación manual. Concurrencia de agente 1 configurable, capturas 1 inicialmente.

Token setup-token renovado por administrador mediante canal seguro cuando caduque o se revoque. Reiniciar worker con nuevo secreto; mantener documentos y sesiones. Probar disponibilidad al arrancar sin publicar credencial ni contenido sensible en logs. Guardar versión CLI y modelo en metadata del job, no información de autenticación.

## Backups

Backup diario con pg_dump y copia de assets inmutables. Para coherencia, suspender brevemente nuevas mutaciones/uploads, finalizar transacciones, dump BD, copiar assets referenciados, reactivar. Alternativa posterior: backup coordinado por snapshot del volumen. Mantener 7 diarios y 4 semanales fuera del servidor con cifrado. Probar restauración en entorno aislado antes de declarar H7 terminado. Estado de Claude es auxiliar; si falta, crear sesión nueva desde documento.

## Observabilidad

Logs estructurados con requestId/jobId/projectId, duración, estado y código de error. Redactar token, cookie, Authorization, env y contenido de referencias. UI muestra progreso normalizado. Alertar disco lleno, fallos de backup, DB caída y autenticación Claude requerida. No medir uso de suscripción como coste API inventado.

## Actualizaciones

Fijar versiones/lockfile/CLI; probar migración sobre copia antes de producción. Migraciones documentales explícitas schemaVersion, nunca mutación silenciosa de snapshots antiguos. Copia previa a migración; rollback por restauración coordinada. Compatibilidad de CLI y auth es prueba de integración, no supuesto permanente.
