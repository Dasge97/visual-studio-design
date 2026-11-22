# Documento de diseño v1

[contracts/design.ts](../contracts/design.ts) define el contrato inicial. Usar IDs estables generados por servidor (UUID en producción; IDs legibles en fixtures). schemaVersion identifica el formato, revision la edición de un workspace, versionId un snapshot inmutable. Son conceptos diferentes.

## Árbol y reutilización

Documento contiene mapas de pantallas, nodos, componentes, tokens, variables, escenarios e interacciones. Pantalla tiene rootId; contenedores listan children ordenados. Un nodo tiene un solo padre dentro del árbol. Definiciones de componente tienen su propio rootId; una instancia apunta al componentId y expone overrides de propiedades autorizadas. No herencia de componentes ni instancias anidadas en MVP; evita ciclos y simplifica edición.

Tipos iniciales: container, text, image, shape, instance. Botón, contador o progreso son composiciones identificables por role; no añadir un tipo especializado para cada uso. Texto se almacena como texto plano, jamás HTML. Imagen apunta a assetId del proyecto. Shapes limitadas a rectangle, ellipse y line; iconos pueden ser imágenes importadas.

Identificar elemento de instancia mediante instanceId + definitionNodeId cuando se selecciona internamente. Overrides solo en claves publicadas por la definición. Cambios de definición detectan todas las pantallas afectadas. Tokens son valores tipados (color/number/string), sin alias recursivos en MVP. Resolver token inexistente como error, no inventar fallback silencioso.

## Layout

Cada nodo es anchored o flow-child. Los contenedores además definen distribución de hijos free/row/column. En free los hijos son anchored; en row/column son flow-child. Anclajes respecto a caja interior del padre: top-left, top-center, top-right, center-left, center, center-right, bottom-left, bottom-center, bottom-right. Offset se suma al punto de anclaje y el pivot correspondiente del hijo se alinea con ese punto. Ejemplo bottom-center con y=-24 deja margen inferior de 24.

Size: fixed(px), hug o fill; min/max opcionales, max >= min. fill solo en flow-child. Texto hug usa métricas reales de la fuente cargada; contenedor hug depende de hijos. Rechazar ciclo de tamaño (padre hug e hijo fill en el mismo eje). Flow usa gap, padding, align start/center/end/stretch y justify start/center/end/space-between. Orden dado por children. zIndex dentro del mismo contexto; overlay de editor no forma parte del documento.

Viewport de referencia por pantalla y presets adicionales. MVP admite overrides de layout/apariencia/visibilidad para presets nombrados, sin sistema completo de breakpoints arbitrarios. Al probar tamaño no nombrado se usa base; la UI lo indica. Exportar anclajes, tamaños y overrides; no convertir todo a coordenadas absolutas.

## Apariencia y estados

Props tipadas: fill, textColor, fontFamily, fontSize, fontWeight, lineHeight, borderColor, borderWidth, radius, opacity, shadow. Nada de CSS arbitrario ni URLs en valores. Componentes estilizan sus nodos; una instancia puede sobreescribir los props expuestos. Precedencia: base → override viewport → override instancia autorizado → reglas de estado activas por prioridad → hover/selected. Empates de prioridad que escriben el mismo campo son error de validación.

Visibility y enabled pueden tener reglas basadas en variables de simulación. Contenido de texto literal o binding simple {variableId,prefix,suffix}; sin plantillas ejecutables. Estado hover se gestiona en renderer y no persiste. selected es estado temporal de simulación salvo que usuario edite explícitamente la propiedad inicial.

## Simulación

Variables number/string/boolean con default. Condiciones declarativas eq/ne/lt/lte/gt/gte, all/any/not. Operandos literal o variable; comparación numérica solo number. Acciones: navigate(screenId), setVariable, incrementVariable(number), setVisible(nodeId,boolean), setSelected(nodeId,boolean), resetScenario. Eventos click/pointerenter/pointerleave. Un evento ejecuta acciones en orden sobre copia temporal, transacción de simulación; fallo no aplica parcialmente. Sin red, filesystem, loops o eval.

Transiciones MVP: opacity o translate, duración 0–500 ms, easing linear/ease; reduced-motion desactiva animación. Pantallas y paneles son los mismos nodos del documento. Cambiar escenario reinicia variables y overrides runtime. Hover no dispara acciones recursivas. Limitar acciones por evento a 20.

## Invariantes

IDs únicos; claves de mapa coinciden con id; referencias internas resueltas; no ciclos; roots válidos; ningún nodo huérfano; constraints de tamaño coherentes; tipos de token correctos; variables y targets existen; recursos pertenecen al proyecto; ningún valor no finito. El servidor devuelve errores con path y mensaje comprensible.

## Decisiones vinculadas

Cada decisión tiene scopes por pantalla/nodo/componente/token y opcional propertyPaths, más fingerprints de valores aprobados. Restricciones duras iniciales: equals, range, visible, anchor y reserved-region. Una intención textual (minimalista, agradable) es soft y requiere criterio; nunca se promete validación automática absoluta.

Un comando determina affectedIds y cierre de dependencias. Edición manual cambia decisión a needs-review sin bloquear experimentación. Agente necesita autorización concreta para alterar una hard constraint o una propiedad aprobada afectada; si no puede determinar compatibilidad de una intención soft, presenta propuesta sin aplicar.
