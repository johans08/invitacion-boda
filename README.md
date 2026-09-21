# Invitación de boda — código para continuar en Codex

## Inicio rápido

1. Descomprime el ZIP y abre esta carpeta en Codex o tu editor.
2. Copia el contenido de PROMPT_CODEX.md como instrucción para Codex.
3. El video de referencia está en reference/Prncs_digitals_video_no_watermark.mp4.
4. Para verla localmente, ejecuta desde esta carpeta:

```bash
python -m http.server 8765 --directory dist
```

En Windows también puedes usar `py -m http.server 8765 --directory dist`.
Abre http://localhost:8765 en tu navegador. Detén el servidor con Ctrl+C.
No requiere npm, instalación de paquetes ni compilación.

## Archivos

- dist/index.html: contenido y estructura de la invitación.
- dist/styles.css: diseño, paleta y estilos adaptables.
- dist/app.js: apertura del pasaporte, navegación y animaciones.
- dist/assets/paper.webp: fondo floral de viajes generado.
- dist/assets/photos/: copias WebP optimizadas de las fotografías temporales de `img/`.
- img/: fotografías originales sin modificar.
- reference/Prncs_digitals_video_no_watermark.mp4: video aportado como referencia visual.
- PROMPT_CODEX.md: instrucciones completas para continuar.

## Estado real

Versión reconstruida y comparada visualmente con fotogramas del video de referencia. Incluye apertura animada del pasaporte, collage de papelería superpuesta, retrato vertical, fecha, guía de ubicaciones, cortejo, vestimenta, RSVP informativo y galería en mosaico. Se revisó en navegador a 360, 390, 768 y 1440 px. Las fuentes externas de Google Fonts requieren Internet y tienen fuentes de respaldo.

Nombres confirmados: Jennifer y Oswaldo. Fecha confirmada: octubre de 2027. Faltan día, horas, lugares, estilo formal y contacto/receptor RSVP. No hay backend, recopilación de respuestas ni música. RSVP muestra «Próximamente»; no almacena ni envía datos. La lista de colores prohibidos se interpreta provisionalmente como vestimenta de invitados, pendiente de confirmación.

## Dónde editar

- Datos: bloque `weddingData` al inicio de `dist/app.js`.
- Contenido y marcadores pendientes: `dist/index.html`.
- Paleta, composición y animaciones: `dist/styles.css`.
- Fotos temporales: originales en `img/`; derivados web en `dist/assets/photos/`.

No rellenes `day`, horarios, lugares, mapas ni `rsvp.endpoint` hasta contar con datos reales. Los botones asociados permanecen deshabilitados intencionalmente.

Esta es una exportación portátil. No contiene credenciales, historial Git ni la configuración que vincula el sitio publicado. Trabajar en esta copia no actualiza automáticamente la web existente. Si Codex trabaja sobre el checkout original, debe respetar sus instrucciones y configuración.
