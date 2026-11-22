# Motor de previsualización

Función conceptual: render(document, screenId, viewport, fidelity, simulationState). Documento inmutable durante render. El mismo paquete Vue se utiliza en editor, comparación, prueba y capturas de exportación.

## Resolución

1. Validar referencias y seleccionar pantalla.
2. Expandir instancias en árbol efectivo con IDs compuestos, sin duplicar documento.
3. Resolver tokens y overrides de viewport/instancia.
4. Evaluar reglas de estado con variables temporales.
5. Traducir layout a DOM/CSS tipado.
6. Aplicar fidelidad y renderizar recursos autorizados.

free usa position relative en padre y absolute en hijos con anclajes/pivots. row/column usa flex con dimensiones y min/max explícitas. Toda pantalla conserva tamaño de diseño; pan/zoom transforman un wrapper exterior, sin reescribir coordenadas. Las cajas de selección pertenecen al editor y no aparecen en capturas de diseño.

## Fidelidad

Boceto reduce fills a grises, muestra placeholders para recursos y conserva medidas, contenido, posiciones y métricas tipográficas del documento para no ocultar desbordamientos. En etapas sin tipografía decidida se usa fuente de sistema explícita. Aspecto aplica estilos definidos; no inventa acabados. Probar usa aspecto y activa intérprete de simulación. Animaciones de hover no modifican documento ni versiones.

Comparación fija iguales condiciones. Mostrar pantalla/viewport/escenario en cada panel. Un boceto es una vista del documento editable, no una imagen generada independiente. La ausencia de recursos se indica con placeholder y diagnóstico.

## Capturas reproducibles

API prepara snapshot inmutable y ruta de render interna con token breve solo de lectura. Playwright abre exclusivamente la ruta de la propia app, tamaño solicitado, deviceScaleFactor fijo, locale y fuentes fijas. Esperar fonts.ready e imágenes decodificadas; desactivar cursor, selección, animaciones y reloj variable. Capturar solo superficie del diseño. Cache por hash de documento, assets, fuentes, rendererVersion, fidelity, viewport, scenario. Nunca cachear solo por screenId.

Capturas devuelven PNG y metadata de condiciones. Para exportación siempre renderizar snapshot, no current que pueda estar cambiando. Preview y export no pueden implementar reglas de layout distintas.

## Alcance visual

HTML/CSS es el medio de previsualización, no una promesa de exportación nativa Godot. Para HUD se usa fondo geométrico o imagen importada y capas UI; no simulación 3D. Contrato conserva intención de anclaje y distribución para traducción por un agente implementador.

Diagnósticos automáticos: nodo fuera del viewport, texto desbordado, tamaños inválidos, dependencias rotas, contraste cuando foreground/background son colores planos conocidos. No afirmar contraste fiable sobre imágenes/transparencia compleja. Zonas reservadas definidas por usuario pueden comprobarse por rectángulos; criterio estético queda al agente/usuario.
