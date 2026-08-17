# Instrucciones para la sesión de implementación (Claude Code)

Pega este archivo como primer mensaje de la sesión y adjunta la carpeta completa.

## Contexto

Este paquete contiene el diseño aprobado de **Academia Diego Romero** (clases de acordeón vallenato): login, dashboard del estudiante, reproductor de clase con simulador de pisadas, zona de ejercicios, tutoriales, tienda con carrito, flujo de regalos, suscripción, perfil, ajustes y certificado. Está diseñado y verificado en **web, tablet y móvil**.

## Qué quiero que hagas

1. Lee `README.md` completo antes de escribir código: contiene inventario de pantallas, tokens de ambos temas, componentes, comportamientos, breakpoints, estado y arquitectura de carpetas.
2. Abre los prototipos de `screens/` en el navegador e inspecciónalos para medir valores exactos cuando dudes:
   - `dashboard-web-tablet-movil.dc.html` → app completa y responsive (fuente de verdad del comportamiento).
   - `mockups-movil-tablet.dc.html` → 8 pantallas móviles + 9 de tablet (fuente de verdad de las adaptaciones).
   - `login.dc.html` → login aprobado (opción `5a`; móvil/tablet en `6a/6b/6c`).
3. **Recrea** el diseño en el stack real. No copies el HTML de los prototipos: son referencias. Si no hay stack definido, usa **Next.js + TypeScript + Tailwind** con la estructura de carpetas del README.
4. Implementa el tema claro/oscuro con variables CSS y `data-theme` en el raíz, más persistencia.
5. Respeta los breakpoints tal como están documentados; el layout debe ajustarse solo, sin versiones separadas por dispositivo.
6. El `FingeringSimulator` es el componente crítico: respeta el modelo del acordeón vallenato (pitos a la izquierda en 3 filas 10/11/10, bajos a la derecha 12 en 2 columnas, columnas escalonadas), la sincronía con la velocidad del video y con el BPM, y sus dos disposiciones (vertical y franja horizontal).
7. Usa datos simulados (fixtures) mientras no exista API; deja los endpoints del README como interfaz esperada.

## Reglas de calidad

- Nada de alto fijo en el video: `aspect-ratio: 16/9` y `max-height`.
- Ningún control táctil por debajo de 44px.
- Contraste AA en ambos temas; foco visible en todo lo interactivo.
- Copys en español de Colombia, tal como aparecen en los prototipos (moneda `$59.900`, fechas `12 sep 2026`).
- Sin librerías de UI pesadas: los componentes son propios, con iconos de trazo (Lucide equivale a los usados).

## Assets

`assets/poster-clean.png` (foto del artista, ya retocada) y `assets/logo-dr-4K.png` (logo sin transparencia: recortar en círculo sobre fondo negro). Falta material real listado al final del README.

## Entrega esperada

Proyecto ejecutable con las 14 pantallas navegables, tema claro/oscuro, carrito y simulador funcionando con fixtures, y un README propio explicando cómo correrlo y dónde conectar la API.
