# Entrega para implementación

Dos exportaciones: **contrato de diseño** para programación y **proyecto editable** para copia/traslado. Ninguna incluye secretos, sesiones Claude o credenciales. Ambas parten de snapshot inmutable con schemaVersion y rendererVersion.

## Contrato ZIP

```text
manifest.json
DESIGN.md
design.document.json
design-tokens.json
layout.json
components.md
interaction-spec.md
decisions.json
acceptance.md
assets/
references/
screens/<screen>/<viewport>/<scenario>.png
```

manifest: exportId, projectId, snapshotId, schemaVersion, rendererVersion, fecha, estado draft/approved, presets/escenarios incluidos, lista de archivos y hashes SHA-256. DESIGN explica objetivos, reglas y pendientes. layout preserva anclajes/flow y medidas; components incluye definiciones e instancias; interaction-spec enumera triggers/condiciones/acciones. decisions conserva aprobaciones y descartes relevantes. acceptance contiene comprobaciones concretas por pantalla/estado.

Generar texto mecánicamente desde datos y decisiones; no exigir una llamada Claude al exportar. Puede incluir explicación previamente guardada por agente, identificada como tal. design.document.json es la representación completa; los demás archivos son vistas derivadas y no fuentes competidoras.

Draft permite decisiones pendientes con lista explícita; approved exige decisiones activas resueltas/aprobadas o descartadas justificadamente y cero errores estructurales. Revisiones estéticas no verificables permanecen claramente señaladas; no prometer calidad automática.

El paquete permite a un agente traducir a Godot/web/móvil. MVP no genera escenas .tscn, aplicaciones móviles ni componentes de producción. El agente implementador recibe criterios y capturas, sin depender de esta aplicación para entenderlos.

## Proyecto editable

Incluye documentos, alternativas, decisiones, snapshots y recursos necesarios; metadatos de versiones y hashes. No necesita exportar conversaciones. La importación de paquetes completos se implementa como parte de portabilidad H6: validar formato, paths y referencias, asignar nuevo projectId y remapear IDs externos; no sobrescribir proyecto existente. Rechazar rutas absolutas, ../ y ZIP desproporcionado. Un proyecto reimportado debe producir las mismas vistas antes de editar.

Exportación asíncrona: queued/running/completed/failed; todos los archivos se generan en directorio temporal y se publica ZIP únicamente al completar/verificar. Fallo no entrega un paquete parcial como correcto. Reintento de job no duplica exportaciones si requestId es el mismo.
