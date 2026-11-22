# Producto y alcance

## Propósito

Ayudar al propietario, desarrollador sin formación visual avanzada, a descubrir y concretar interfaces profesionales antes de delegar su implementación. La dificultad incluye imaginar alternativas y comunicar lo deseado. El software debe aportar criterio sobre jerarquía, composición, peso visual, densidad, espacio libre, affordance, visibilidad contextual, lenguaje visual y movimiento.

El producto principal es el programa. La IA colabora dentro de él. No se exige estudiar diseño ni dominar vocabulario técnico. No se diseña un chat genérico ni un editor vectorial generalista. El criterio de éxito es obtener decisiones coherentes y una especificación implementable, no generar muchas imágenes.

## Requisitos confirmados

| ID | Requisito |
| --- | --- |
| P01 | Uso personal de un único propietario, web alojada en servidor. |
| P02 | Videojuegos, web y móvil comparten núcleo; Twin Hills es primer caso de prueba. |
| P03 | Admite idea funcional incompleta e interfaz/componentes ya definidos. |
| P04 | Toda decisión visual importante tiene una representación comprensible. |
| P05 | Boceto, aspecto y prototipo evolucionan sobre el mismo documento. |
| P06 | Comparación A/B, combinación por elementos y variantes de regiones. |
| P07 | Edición manual de selección, movimiento, tamaño y propiedades sin IA. |
| P08 | Programa conserva diseños, decisiones, motivos, restricciones y descartes. |
| P09 | Cambiar/reiniciar sesión o modelo no pierde el estado del proyecto. |
| P10 | Agente disponible durante todo el proceso, con criterio y detección de conflictos. |
| P11 | Sugiere discretamente, explora en alternativas y ejecuta instrucciones directas reversibles. |
| P12 | Consulta antes de contradecir decisiones aprobadas o ampliar cambios a otras pantallas. |
| P13 | Prototipos con navegación, paneles, hover, selección, estados, transiciones y variables de ejemplo. |
| P14 | Referencias importadas y anotadas; no reconstrucción automática de capturas en MVP. |
| P15 | Claude Code dedicado en servidor con token de claude setup-token. |
| P16 | Exportación estructurada, versionada y acompañada de vistas para agentes programadores. |
| P17 | Guardado automático, versiones recuperables y aprobación distinta de edición. |

## MVP

Proyectos con varias pantallas; primitivas, componentes reutilizables por proyecto, estilos compartidos; comparación de dos alternativas por vez; combinación explícita por elementos; escenarios de prueba; editor e inspector; decisiones con historial; integración Claude y exportación. Interfaz de trabajo optimizada para ordenador (1280 px o superior); poder diseñar móviles no implica editar cómodamente desde un teléfono en MVP.

Importación de referencia: PNG/JPEG/WebP hasta 10 MiB; selección rectangular normalizada y nota libre. No convertir texto o elementos de una imagen a nodos automáticamente. Se pueden incorporar imágenes como recursos en un diseño.

Fuera de MVP: equipos, permisos por rol, SaaS/facturación, bibliotecas entre proyectos, lógica de negocio completa, assets 3D, motor Godot embebido, colaboración en tiempo real, dibujo vectorial avanzado, JS arbitrario, generación de código final y sincronización bidireccional. Revisión automática de capturas implementadas es objetivo posterior; exportar las vistas aprobadas sí está incluido.

Generar imágenes con otro proveedor no es requisito del MVP. Usar recursos importados, primitivas y estilos para explorar; no añadir claves de imagen ni créditos como dependencia. Investigación externa de referencias puede hacerse manualmente en esta versión.

## Recorrido completo

Descubrimiento → exploración → composición → dirección artística → validación → entrega. Etapas flexibles, con retorno a cualquier punto. El agente decide preguntas útiles según contexto; no hay formulario obligatorio interminable. Usuario puede explorar sin aprobar, editar sin conversar y reabrir decisiones.

## Caso de validación

Fixture Twin Hills: HUD con contador, progreso y acceso a mejoras; panel de mejoras; escenarios sin recursos y mejora disponible. Valores, herramientas y comportamiento son sintéticos para probar el editor. No importar lógica real ni modificar el repositorio Twin Hills.
