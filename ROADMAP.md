# Implementación por hitos

Todos pendientes. El repo inicial entrega especificación; no marca software como realizado.

## H0 — Base y prueba de Claude

- [ ] npm workspaces, paquetes del árbol de START-HERE, TS estricto, lint/formato, lockfile y CI.
- [ ] Fijar versiones exactas; migración SQL inicial y configuración desarrollo PostgreSQL.
- [ ] Validadores runtime desde contratos y fixtures; shared command engine vacío con interfaces.
- [ ] Prueba CLI real con setup-token: MCP allowlist, streaming, sesión explícita, cancelación y herramientas bloqueadas. Registrar versión/invocación.
- [ ] Comandos documentados para instalar, desarrollar, comprobar y probar.

Salida: entorno reproducible y evidencia de viabilidad CLI. Si no hay token disponible, registrar prueba pendiente y seguir H1, sin afirmar integración validada. No pedir credenciales en chat/git.

## H1 — Editor manual persistente

Depende H0 base. Login propietario, proyectos/pantallas, carga fixture, renderer básico, árbol, selección/movimiento/tamaño/propiedades, anchored y flow, tokens básicos, autosave, undo/redo, revisiones e idempotencia. A01–A06 pasan. Primera demo usable sin agente.

## H2 — Decisiones y alternativas

Depende H1. Scopes, restricciones y fingerprints; A/B con condiciones iguales, tercera alternativa por combinación, decisiones/descartes/motivos, snapshots y restauración. A07–A10 pasan. No implementar fusión automática compleja.

## H3 — Componentes y render de aspecto

Depende H2. Definiciones/instancias/overrides, recursos y anotaciones, estilos, viewport presets, capturas Playwright del renderer compartido. A11–A12 y A25 pasan. Añadir fixture web/móvil de prueba.

## H4 — Agente integrado

Depende H3 y prueba real H0. Worker, trabajos/events SSE, bridge MCP, contexto por proyecto, propuestas visibles, permisos/grants, cancelación y recuperación. A15–A20 pasan. Mostrar scopes y efecto de cambios globales. UI debe conservar edición manual durante tarea.

## H5 — Prototipo y escenarios

Depende H3; puede implementarse antes de H4 si faltan credenciales. Variables/condiciones/acciones/transiciones, navegación/paneles y reset. A13–A14 pasan. H4 incorpora estas herramientas al completarse H5.

## H6 — Exportación y recorrido completo

Depende H2–H5. Contrato ZIP, exportación editable e importación a nuevo proyecto, manifiesto/hashes, capturas consistentes, modos draft/approved. A21–A25 pasan. Demo: describir → alternativas → editar → probar → aprobar → exportar. Con Claude apagado sigue funcionando el recorrido manual.

## H7 — Servidor y cierre de MVP

Depende H6. Docker/proxy HTTPS, volúmenes, logs redactados, backup/restore probado, límites/errores, comprobaciones de acceso privado. A26 pasa; medir rendimiento y documentar instalación. No desplegar credenciales ni abrir acceso público sin configuración real del propietario.

## Después del MVP

Revisión de capturas implementadas; búsqueda de referencias asistida; más herramientas visuales; librerías entre proyectos; reconstrucción de capturas; integraciones con motores. No compromiso de fechas ni desarrollo de estas funciones ahora.
