# Decisiones y referencias

## Origen

Requisitos de producto: conversación original aportada en vídeo (22/11/2026), texto de encargo y acuerdos posteriores. El vídeo prevalece ante discrepancias. Aquí solo se guarda la consolidación relevante, no transcripciones ni datos personales. Organización visual aprobada en docs/assets/flujo-conceptual.webp. El propietario autoriza cerrar decisiones restantes y pasar a implementación; las elecciones siguientes son técnicas delegadas.

| ID | Decisión | Motivo y límite |
| --- | --- | --- |
| D01 | Web de servidor, un propietario | Acuerdo explícito; sin SaaS ni colaboración. |
| D02 | Vue 3 + TS y renderer DOM/CSS | Componentes reactivos, texto y layouts compartidos; evitar construir motor tipográfico propio. |
| D03 | Node 24 + Express 5 | Un lenguaje para contratos, CLI y frontend; API pequeña y explícita. |
| D04 | PostgreSQL 17 + JSONB + pg | Documento flexible con transacciones e historial relacional; usar versión madura, no perseguir última major. |
| D05 | CLI Claude Code + setup-token | Requisito del propietario; bridge MCP y proceso gestionado. |
| D06 | Sesiones separadas por proyecto, worker con cola | Contexto aislado, cancelación y recuperación. |
| D07 | Snapshots completos y revisión optimista | Simplicidad para MVP, recuperación fiable; sin CRDT/event sourcing. |
| D08 | Layout free anclado y flow row/column | Acuerdo explícito; núcleo válido para HUD y formularios. |
| D09 | Simulación declarativa limitada | Validar interfaz sin recrear aplicación/juego ni ejecutar código arbitrario. |
| D10 | Playwright y renderer compartido | Capturas coherentes con el editor. |
| D11 | Sin importación automática de capturas | MVP básico confirmado. |
| D12 | Exportación sin IA obligatoria | Editor autónomo y contrato reproducible. |

## Investigación inicial, no auditoría exhaustiva

Figma Make cubre generación/prototipos; Penpot MCP permite agentes sobre datos de diseño; UXPin Forge trabaja con componentes y edición asistida. Estas capacidades no deben presentarse como invenciones propias. Oportunidad de producto propuesta: decisiones guiadas con alternativas visibles, motivos/restricciones persistentes y exportación para proyectos heterogéneos de un desarrollador individual. No afirmar que ningún competidor lo hace sin investigación adicional. Google Stitch y Magic Patterns se mencionaron como referencias en la conversación original; no fueron evaluados aquí en profundidad.

## Fuentes primarias consultadas el 22/11/2026

- [Vue introduction](https://vuejs.org/guide/introduction.html): componentes y reactividad.
- [PostgreSQL JSON types](https://www.postgresql.org/docs/current/datatype-json.html): JSONB y consultas. Elección de major 17 es nuestra, no una recomendación de usar la última.
- [Claude Code authentication](https://code.claude.com/docs/en/authentication): setup-token y variable de entorno OAuth.
- [Claude Code programmatic use](https://code.claude.com/docs/en/headless): modo no interactivo, formato estructurado y sesiones.
- [Claude Code CLI](https://code.claude.com/docs/en/cli-reference): flags; deben verificarse contra la versión fijada en H0.
- [Playwright screenshots](https://playwright.dev/docs/screenshots): captura de página/elemento.
- [Penpot MCP](https://help.penpot.dev/mcp/).
- [Figma Make](https://help.figma.com/hc/en-us/articles/31304485164695-Create-a-Figma-Make-file).
- [UXPin Forge](https://www.uxpin.com/docs/forge/what-is-forge/).

No se ha probado aún compatibilidad end-to-end de esas dependencias ni autenticación real de Claude en el servidor. H0 convierte las decisiones en una base ejecutable con versiones y pruebas registradas. Si algo cambia upstream, resolver y documentar sin sustituir silenciosamente requisitos del propietario.
