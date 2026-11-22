# Experiencia e interfaz

## Organización aceptada

Ver [boceto conceptual](assets/flujo-conceptual.webp). Inicio guiado; comparación; editor estable. El boceto ilustra organización, no estilo final ni funcionalidades implementadas.

Shell desktop: altura de ventana completa. Barra superior 56 px; panel izquierdo 240 px plegable; inspector derecho 300 px plegable; lienzo ocupa el espacio restante. Los paneles tienen scroll propio; el lienzo pan/zoom. A 1280 px permitir plegar laterales y comparación con una alternativa ampliada. No imponer scroll vertical de toda la app para tareas normales.

Izquierda: pestañas Pantallas / Decisiones; dentro de Pantallas, árbol de elementos de la pantalla seleccionada. Centro: lienzo y barra Boceto / Aspecto / Probar, viewport y escenario. Derecha: inspector, sustituible temporalmente por ayuda contextual. Petición al agente debajo del lienzo, plegable, con contexto visible y acceso a conversación completa en panel desplegable.

Defaults técnicos de UI: fondo neutro, acento teal para selección/acción principal, fuente de sistema, espaciado múltiplos de 4, controles de 36 px, iconos con etiqueta/tooltip. No confundir estos tokens de la app con los del diseño del usuario. La identidad de marca puede cambiar sin alterar el modelo.

## Inicio

Listado de proyectos, crear/abrir/archivar. Crear con nombre, tipo game/web/mobile y descripción opcional. Referencias opcionales. Acciones Explorar con agente y Abrir editor; no bloquear al usuario sin descripción o sin Claude disponible. El agente puede sugerir pantallas o necesidades, pero deben verse y poder editarse.

## Comparación

Elegir A y Elegir B siempre visibles, junto a Combinar y Más alternativas. Ambas vistas usan mismo viewport, escenario y fidelidad. Selección temporal no equivale a aprobación. Ver diferencias de estructura/atributos y explicación breve; permitir descartar con motivo opcional.

Combinar: seleccionar elementos de A o B, marcar destino y previsualizar una tercera alternativa. Importar dependencias de componentes/tokens/variables. Conflicto por mismo ID con contenido distinto requiere elegir origen o clonar con IDs nuevos; nunca tomar un valor silenciosamente. Copias parciales con targets externos no disponibles requieren remapeo antes de aplicar. MVP usa el núcleo compartido de operaciones, sin fusión automática compleja.

## Edición

Selección por clic, árbol o shift-click para grupo; arrastrar, redimensionar, duplicar, eliminar, ordenar. Escape limpia selección, Supr elimina salvo campo de texto activo; Ctrl/Cmd+Z deshace, redo con Ctrl/Cmd+Shift+Z. Edición de valores y movimiento por teclado. Arrastre produce preview local continuo y un comando al soltar. Cambio numérico se confirma con Enter o blur.

Nodos anclados cambian offset. Hijos de flow se reordenan; no convertirlos silenciosamente a coordenadas absolutas. Inspector explica el modo de layout y permite cambiarlo explícitamente. Snap a bordes/centros opcional y reversible. Doble clic dentro de componente permite editar definición mediante acción explícita; por defecto se edita la instancia y sus overrides autorizados.

## Decisiones

Estados: pendiente, explorando, aprobada, requiere revisión, descartada. Se aprueba con alcance visible: «Aprobar distribución del HUD». Motivo se sugiere y el usuario puede modificarlo; nunca pedir justificación por cada movimiento. Una edición manual contraria a lo aprobado se conserva y marca la decisión afectada para revisión. El agente debe solicitar permiso antes de ese mismo cambio. La aprobación es un endpoint exclusivo del propietario.

## Agente

Antes de enviar se muestra ámbito: proyecto/pantalla/selección. Estado visible: en cola, analizando, preparando variantes, esperando tu decisión, completado, cancelado o error. Cancelar siempre disponible. Sugerencias proactivas discretas después de guardar y con cooldown, desactivables; no ejecutar un análisis por cada pixel de drag.

Las solicitudes de ampliar ámbito muestran pantallas y componentes afectados. Se autoriza la propuesta concreta, no un permiso ilimitado para todo el proyecto. No mostrar prompts, tokens internos ni herramientas como parte del flujo habitual.

## Guardado y errores

Indicadores Guardando / Guardado / Sin conexión / Conflicto. Nunca indicar guardado antes de confirmación del servidor. Un conflicto conserva el borrador local y ofrece recargar estado remoto o convertir trabajo en alternativa; no sobrescribe. Al desconectar se mantiene la sesión local en memoria y se avisa antes de salir; no prometer modo offline persistente.

## Prueba y exportación

Probar desactiva controles de edición y activa interacción; Restaurar escenario repone variables. Salir no guarda valores simulados. Exportar abre resumen de versión, decisiones pendientes, viewports y escenarios. Exportación borrador disponible con advertencias incluidas. Exportación aprobada exige ausencia de decisiones afectadas pendientes y errores estructurales.
