# Ayuda

## ¿Qué hace Prompter?

Prompter es un teleprónter local que funciona en el navegador. Puedes escribir o abrir un guion, configurar la duración prevista y la legibilidad, e iniciar el modo de presentación.

## Inicio rápido

1. Pega el texto en el campo de texto.
2. Configura la duración prevista directamente o mediante una plantilla de temporizador, el tamaño de fuente, el interlineado, la tipografía, los colores, el modo espejo, la línea de enfoque y la cuenta atrás.
3. Comprueba la «Vista previa» o inicia la «Presentación».
4. En el modo de presentación, pulsa la barra espaciadora para pausar o reanudar.
5. Usa las flechas arriba y abajo para cambiar la velocidad.
6. Usa las flechas derecha e izquierda o Re Pág/Av Pág para saltar entre encabezados y marcadores de sección.
7. Pulsa `R` para reiniciar y Escape para volver al editor. Las ejecuciones completadas y canceladas aparecen en el historial de presentaciones.

## Vista previa y formato

La vista previa usa la misma presentación visual que el modo de presentación y se puede reproducir, pero no incluye la cuenta atrás ni añade entradas al historial. Los cambios en el tamaño de fuente, el interlineado, el modo espejo y la línea de enfoque se muestran al instante.

El editor admite Markdown en el guion. Los encabezados, la **negrita** y la *cursiva* se muestran en la vista previa y en la presentación. Las líneas horizontales (`---`) pueden servir como marcadores de sección.

## Uso del teclado

- `Tab`: recorre los controles del editor y de la presentación.
- `Space`: inicia, pausa o reanuda la presentación.
- `Flecha arriba` / `Flecha abajo`: cambia la velocidad.
- `Flecha izquierda` / `Flecha derecha` o `Re Pág` / `Av Pág`: cambia de sección.
- `R`: reinicia la presentación.
- `Escape`: cierra la vista previa o la presentación.

## Guardar y abrir proyectos

El borrador actual se guarda automáticamente en el navegador. Este guardado solo sirve para recuperar el trabajo en ese mismo navegador.

Para crear una copia de seguridad permanente, guarda un archivo `.prompter` con «Guardar proyecto». Después puedes volver a cargarlo con «Abrir proyecto». Al abrirlo, se reemplaza el borrador actual; la aplicación te lo confirmará antes.

También puedes importar archivos `.txt` y `.md` directamente como texto del guion. Estos archivos no se tratan como proyectos completos.

Se rechazan los archivos no válidos, demasiado grandes o con versiones de proyecto no compatibles. En ese caso, se conserva el borrador actual.

## Eliminar datos

«Nuevo» elimina el borrador guardado en este navegador y restaura el proyecto de ejemplo. El historial de presentaciones tiene su propio botón para borrarlo y puede exportarse como CSV. Después de «Nuevo» y «Vaciar» aparece una opción para deshacer la acción hasta que sigas trabajando o cierres la pestaña. También puedes eliminar los datos del sitio desde la configuración del navegador.

## Dispositivos compatibles y límites

Prompter está diseñado para navegadores modernos de escritorio y móviles. La aplicación usa `localStorage`, la API de pantalla completa del navegador, Web Audio para la señal de finalización, Wake Lock opcional durante la presentación y un service worker para las funciones PWA.

Los archivos de proyecto son archivos JSON con la extensión `.prompter`. El límite de importación actual es de 500 KB. Los textos muy largos se limitan a 100.000 caracteres.

## Comentarios

- [Informar de un error](https://haak3.atlassian.net/jira/software/form/69a50efc-0474-445e-8f01-66eb6b747cc1)
- [Sugerir una función](https://haak3.atlassian.net/jira/software/form/50d4fc51-bff4-4e21-b46e-8fd987b90d24)
- Como alternativa, escribe a [apps@haak3.de](mailto:apps@haak3.de).

No compartas contenido privado de tus guiones.
