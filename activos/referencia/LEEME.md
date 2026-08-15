# Activos de referencia

Material que **no se usa en la aplicación**. Vive aquí para no perderlo y para dejar
constancia de por qué se descartó.

Los activos que la aplicación sí sirve viven en `frontend/public/imagenes/`.

---

## Qué hay

| Archivo | Qué es | Tamaño |
|---|---|---|
| `collage-vallenato-made-in-colombia.jpg` | Collage con sombrero vueltiao, acordeón, caja, guacharaca, guacamayas y sello «MADE IN COLOMBIA» | 567 × 720 |
| `ilustracion-acordeonista-low-poly-amarillo.jpg` | Ilustración vectorial *low-poly* de un acordeonista sobre fondo amarillo | 404 × 316 |
| `ilustracion-acordeonista-atardecer-naranja.png` | Ilustración plana de un acordeonista sobre atardecer naranja | 404 × 316 |
| `acordeon-rojo-dorado-recorte.webp` | Acordeón diatónico rojo y dorado, recortado sobre fondo claro | 436 × 337 |

Se entregaron el 15 de agosto de 2026 con nombres de archivo ilegibles (`08b64c6dd39…jpg`) y
un duplicado exacto, verificado por MD5 y eliminado.

## Por qué ninguno entra a la aplicación

**Son demasiado pequeños.** El mayor tiene 567 px de ancho. Un fondo de héroe necesita unos
2400 px; a este tamaño se verían borrosos en cualquier pantalla moderna.

**Son ilustraciones genéricas.** El handoff aprobado lo prohíbe expresamente
(`docs/04 §7`): en una marca personal, un acordeonista anónimo comunica lo contrario de lo
que vende la página. Diego *es* el producto.

**Chocan con la paleta.** El amarillo y el naranja saturados pelean con «Azul rey», donde el
mango es una chispa y nunca un fondo.

**Arrastran derechos sin verificar.** Dos parecen provenir de Behance y una de Wikipedia. Usar
material de autor identificable en un sitio comercial sin licencia es un riesgo legal para
Diego, no una cuestión de gusto.

## Qué hace falta en su lugar

Una sola sesión de fotos resuelve la página entera:

| Necesidad | Formato | Mínimo |
|---|---|---|
| Diego tocando, para el héroe en móvil | vertical 4:5 | 1600 px de ancho |
| Diego tocando, para el héroe en escritorio | apaisada 16:9 | 2400 px de ancho |
| Manos sobre los botones del acordeón | apaisada | 1600 px |
| Capturas del simulador funcionando | 16:10 | pantalla real |

Con un móvil actual basta: luz natural y fondo limpio. Es la tarea de mayor retorno pendiente
del proyecto.

Mientras tanto la página **no se ve incompleta**: cada hueco lo pinta `<adr-marco-imagen>` con
un degradado del propio sistema. Se ve gráfica y deliberada, no rota. Cuando lleguen las fotos,
se dejan en `frontend/public/imagenes/` y se cambian cinco valores nulos en
`frontend/src/app/disenio/activos.ts` — ni una plantilla, ni un `.scss`, ni un componente.
