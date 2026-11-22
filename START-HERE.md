# Arranque de implementación

## Encargo listo para copiar al agente de programación

> Implementa Visual Studio Design siguiendo AGENTS.md y la documentación. Empieza por H0 de ROADMAP.md y continúa con H1. El objetivo inicial es un editor manual persistente que cargue examples/twin-hills.design.json, permita seleccionar, mover y editar elementos, cambiar entre boceto/aspecto y recuperar el resultado al recargar. Prepara la integración de Claude Code con setup-token mediante una prueba real aislada; no la sustituyas por la API de Anthropic. No desarrolles todos los hitos a la vez ni presentes mocks como funcionalidades terminadas. Registra el progreso, las pruebas y los límites en docs/progress.md.

## Estructura que debe crear H0

```text
apps/web/              Vue: shell, editor, comparación, inspector, decisiones
apps/api/              Express: autenticación, API, comandos, exportación
apps/agent-worker/     Cola PostgreSQL, ciclo de Claude CLI, MCP stdio
packages/domain/      Tipos, validación, comandos puros, dependencias, simulación
packages/renderer/    Vue: render de documento, reutilizado en captura y preview
packages/contracts/   Validación de API/MCP y errores
db/migrations/        SQL versionado
tests/                Integración y E2E
```

Usar npm workspaces para minimizar herramientas extra. Runtime Node 24, PostgreSQL 17; fijar versiones exactas compatibles y lockfile en H0. Bibliotecas previstas: Vue 3, Vite, Pinia, Vue Router, Express 5, pg, Zod, MCP SDK oficial, Vitest, Playwright. No se requiere ORM ni Redis para el MVP.

Los archivos contracts/design.ts y examples/*.json son el punto de partida normativo. Mover o generar tipos hacia packages/domain al implementar sin mantener copias divergentes; actualizar enlaces. El esquema SQL de contratos es una base de migración, no una BD ya desplegada.

## Criterio de primera demostración

Arrancar desarrollo con comandos documentados; entrar con el propietario; cargar fixture; mover contador; guardar; recargar; conservar posición; otra pestaña no sobrescribe una revisión más reciente. El renderer no depende de Claude. La prueba CLI de H0 registra versión exacta y confirma herramientas permitidas, streaming, cancelación y recuperación de sesión.
