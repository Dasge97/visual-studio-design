# Aceptación verificable del MVP

Los siguientes son criterios para implementación, no pruebas que ya hayan pasado.

| ID | Prueba y resultado esperado | Hito |
| --- | --- | --- |
| A01 | Abrir fixture, editar posición/texto, guardar y recargar: resultado idéntico sin Claude. | H1 |
| A02 | Arrastrar 30 eventos produce una acción; undo/redo conservan valores y revisiones coherentes. | H1 |
| A03 | Dos pestañas parten de rev 4; primera guarda rev 5; segunda recibe 409 y conserva su borrador. | H1 |
| A04 | Repetir requestId tras timeout devuelve mismo resultado sin duplicar nodos; body distinto falla. | H1 |
| A05 | Comando con dos cambios, segundo inválido: ninguno se persiste. | H1 |
| A06 | Cambiar viewport conserva anclajes y flow; no convertir posiciones a pixels por cada resolución. | H1 |
| A07 | A y B muestran mismo contenido/escenario; elegir cualquiera conserva la otra. | H2 |
| A08 | Combinar nodos con token del mismo ID y valor distinto exige resolución explícita y no rompe referencias. | H2 |
| A09 | Aprobar distribución crea snapshot; edición manual afectada marca needs-review; color ajeno al scope no la invalida. | H2 |
| A10 | Restaurar versión antigua conserva acceso a todas las posteriores. | H2 |
| A11 | Instancias reflejan actualización de definición; override autorizado local se conserva; alcance global se detecta. | H3 |
| A12 | Boceto/aspecto/prueba usan mismo árbol; geometría coincide salvo cambios de estado explícitos. | H3 |
| A13 | Escenario sin recursos usa dinero=0 y deshabilita compra; available permite evento; reset repone valores. | H5 |
| A14 | Salir del prototipo no guarda variables de simulación. | H5 |
| A15 | CLI real autentica con setup-token, usa herramientas MCP, devuelve streaming y recupera sesión. | H0/H4 |
| A16 | Claude genera dos alternativas renderizables; usuario aplica una; recarga conserva el resultado. | H4 |
| A17 | Intentos del agente de shell, otro proyecto o autoaprobación son rechazados por permisos/backend. | H4 |
| A18 | Cambio sobre decisión aprobada solicita autorización; grant ligado a hash no sirve para otro comando. | H4 |
| A19 | Usuario edita mientras Claude trabaja: variante antigua no sobrescribe current. | H4 |
| A20 | Cancelar impide nuevas mutaciones; reiniciar worker marca job interrumpido, conserva las aplicadas. | H4 |
| A21 | ZIP exportado apunta a snapshot exacto, hashes correctos, textos/componentes/estados presentes. | H6 |
| A22 | Exportación borrador señala pendientes; approved bloquea errores y revisiones pendientes. | H6 |
| A23 | Importar proyecto en uno nuevo y renderizar reproduce captura, sin copiar secretos/sesiones. | H6 |
| A24 | Agente apagado: editor, escenarios, guardado y exportación siguen disponibles. | H6 |
| A25 | Capturas no incluyen inspector/selección; fuentes/viewport/escenario reproducibles. | H3/H6 |
| A26 | Login y recursos privados; restauración backup recupera documentos y assets; no secretos en logs. | H7 |

Unitarias: layout/validación, operaciones, cierre de dependencias, condiciones, escenarios y comparación de decisiones. Integración con PostgreSQL real: transacciones, idempotencia, conflictos, grants y snapshots. E2E: recorrido manual y asistido, captura visual y exportación. CLI real con token en entorno autorizado; CI usa transporte simulado para errores deterministas sin afirmar integración real.

Smoke adicional de independencia: fixture web sencilla con formulario en columna y fixture móvil con navegación. No basta probar solo el HUD. Establecer y medir límites de nodos, memoria y capturas; no ampliar alcance sin necesidad.
