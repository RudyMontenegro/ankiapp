# Grammar Recall

Repaso de gramática inglesa con situaciones en español. HTML, CSS y JavaScript vanilla, sin dependencias de ejecución, cuentas, backend ni conexiones externas.

## Abrir la app

Abre `index.html` en un navegador moderno. Conserva `styles.css`, `cards.js`, `engine.js` y `app.js` junto al HTML. No necesitas instalar nada ni iniciar un servidor. La app funciona sin conexión cuando sus archivos están disponibles.

Elige estructuras, modo y 10 o 20 tarjetas. En construcción puedes responder mentalmente o por escrito. Revela y evalúa con Otra vez, Difícil o Fácil. La comparación escrita reconoce modelos, alternativas y contracciones; una diferencia textual no significa que tu traducción sea incorrecta.

Teclado: Espacio revela la respuesta; 1, 2 y 3 evalúan. Los atajos no actúan mientras escribes o tienes un control enfocado. Usa Tab y Enter para los controles.

## Progreso y repaso

`localStorage` guarda el estado bajo `grammar-recall-v1`, con versión de esquema 1. El progreso es independiente por tarjeta y modo; construcción mental y escrita comparten estado. El texto escrito, la respuesta revelada y la cola de la sesión también se conservan. Inicio permite continuar una sesión interrumpida.

- Otra vez: intervalo 0, pendiente en 10 minutos y repetición tras dos tarjetas intermedias si quedan suficientes. Solo una repetición adicional por tarjeta y sesión.
- Difícil: `ceil(max(1, intervalo anterior × 1.2))` días.
- Fácil: `ceil(max(3, intervalo anterior × 2.5))` días.
- Vencidas antes de nuevas. Las futuras no se usan para rellenar; una sesión puede tener menos tarjetas. Los modos se mezclan sin repetir estructura consecutiva mientras haya alternativas en el grupo disponible.
- Repasar falladas incluye las tarjetas cuya última evaluación fue Otra vez, aunque todavía no hayan vencido.

El resumen cuenta cada evaluación, incluidas las repeticiones. Las estructuras a mejorar se ordenan por la suma de Otra vez y Difícil en esa sesión.

Si el almacenamiento falla, se trabaja en memoria y se muestra un aviso. Datos corruptos o de versiones desconocidas no se sobrescriben. Ajustes → Reiniciar progreso permite reemplazar los datos con confirmación, sin borrar el contenido. Borrar los datos del navegador, mover los archivos o cambiar de navegador puede perder o separar el progreso. No hay sincronización.

## Android, iPhone y publicación estática

Prueba abrir `index.html` con los archivos asociados disponibles, iniciar una sesión, evaluar, recargar y cerrar/reabrir el navegador. En Android y especialmente iOS, el visor de archivos puede no ejecutar JavaScript, cargar los archivos asociados o conservar `localStorage`. En navegación privada el progreso puede ser temporal.

Si la apertura local falla, publica los cinco archivos de la app en un alojamiento estático HTTPS. Por ejemplo, sube los archivos a un repositorio de GitHub; en Settings → Pages elige publicar desde la rama que contiene el sitio y su carpeta raíz. Abre la dirección que indique el alojamiento y verifica que el progreso persista al recargar. No subas datos personales ni necesitas un backend. Esta versión no ha sido publicada.

Un sitio HTTPS facilita el uso móvil, pero este MVP no tiene service worker: no garantiza recarga offline desde una URL web. La ejecución offline garantizada por diseño es desde los archivos disponibles localmente. PWA e instalación quedan pendientes.

## Agregar o revisar tarjetas

`cards.js` contiene las 11 estructuras y el banco de 66 situaciones (seis por estructura). Cada fila usa `[situación ES, modelo EN, polaridad, explicación ES, alternativas EN opcionales]`. Polaridades: `positive`, `negative`, `question`. Añade filas al final de cada grupo; conserva el orden y los IDs existentes para no cambiar su asociación con el progreso guardado. Para cambios de identidad o eliminación de tarjetas, actualiza la versión del esquema y añade una migración antes de distribuir la nueva versión.

Las fichas de uso toman dos ejemplos de cada estructura; identificación y construcción reutilizan el mismo banco. Hay 143 tarjetas de repaso: 11 fichas + 66 de identificación + 66 de construcción. Las 66 situaciones no se contabilizan dos veces como contenido original.

Revisa naturalidad, traducción, polaridad y contexto. En preguntas ambiguas, explica otras lecturas y registra alternativas válidas. BE también es auxiliar en continuos y pasiva. Continuos usan verbo-ing; perfectos y pasiva usan V3. El banco cubre can, could, should, would, might, may y will; must no se incorpora al contenido por defecto. Los ejemplos del plan están incluidos; no se han recibido ni usado fotografías del docente.

## Verificación de desarrollo

Con Node.js: `node --test tests/engine.test.cjs`. Comprueba cobertura, intervalos, prioridad, filtros, repetición, comparación y carga de datos.

La prueba opcional `node tests/browser.test.cjs` requiere Playwright y Microsoft Edge disponibles en el entorno de desarrollo. Verifica la app real con archivos locales, recarga, modos, teclado, resumen, reinicio, esquemas desconocidos y tamaños móvil/escritorio. Estas herramientas no forman parte de la app.

Pendiente: PWA, exportar/importar JSON, editar tarjetas desde la interfaz, audio y sincronización entre dispositivos.
