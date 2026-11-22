# Instrucciones para agentes de implementación

## Misión y autoridad

Implementar el producto descrito en docs; no comenzar una nueva fase de entrevistas. El propietario ha delegado las decisiones técnicas restantes. La conversación del vídeo aportado tuvo prioridad sobre resúmenes anteriores; su contenido relevante está consolidado en docs/01-product.md. No se necesita acceder al vídeo para implementar.

Leer README.md, START-HERE.md, ROADMAP.md y el documento del área antes de editar. Orden de autoridad: instrucciones nuevas del propietario; requisitos explícitos de producto; decisiones técnicas registradas; boceto ilustrativo. Actualizar documentación si una instrucción nueva cambia el contrato.

## Reglas de implementación

- TypeScript estricto, Vue Composition API y single-file components. Código y contratos en inglés; UI y documentación en español.
- Un solo motor de comandos y un solo renderer compartidos. El agente no mantiene una segunda representación del diseño.
- Ninguna mutación de documentos desde componentes UI fuera del motor de comandos; navegador optimista, servidor autoritativo.
- Validación en servidor, transacciones atómicas, control de versión e idempotencia. No descartar cambios silenciosamente.
- El agente no aprueba sus propuestas, no modifica la BD directamente y no tiene herramientas de shell/edición de código en producción.
- No introducir llamadas directas a la API de Anthropic ni sustituir setup-token por otra autenticación. Si la prueba real de la CLI falla, documentar el bloqueo y continuar el editor independiente.
- No usar bypassPermissions ni dangerously-skip-permissions. Las restricciones las impone el programa, no solo el prompt.
- Una tarea del agente modifica solo el ámbito concedido. Para ampliar alcance se necesita la acción del usuario prevista en la UI.
- No ejecutar JavaScript arbitrario del documento. Simulación declarativa y recursos por ID.
- Conservar estilos y componentes comunes de la aplicación; no reinventar botones/paneles en cada pantalla. Diferenciar el estilo de la app de los estilos de los proyectos diseñados.
- No añadir generación 3D, ecommerce, equipos, marketplace, conversión automática de capturas ni sincronización con código.
- No incluir secretos, sesiones reales, transcripciones privadas ni datos personales en git.

## Entrega por hito

Implementar una porción completa con pruebas significativas, sin mocks presentados como integración real. Actualizar ROADMAP.md y docs/progress.md con cambios, comandos ejecutados, resultados y límites. Mantener los contratos y fixtures sincronizados. Hacer commits pequeños con mensajes que expliquen el comportamiento entregado. No marcar hitos hechos hasta cumplir sus criterios.

En H0 fijar versiones exactas de paquetes y CLI, generar lockfile y CI. No asumir que las versiones instaladas en otra máquina están verificadas. Las pruebas de comandos, conflictos, persistencia y exportación son obligatorias; los cambios de texto aislados no requieren tests nuevos.

## Primera tarea

H0, después H1. No construir primero un chat con respuestas de muestra. El primer recorrido funcional debe permitir cargar el ejemplo, editar, guardar y recuperar sin IA.
