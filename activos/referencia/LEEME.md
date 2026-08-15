# Activos de referencia

Material original entregado por el propietario. Vive aquí como copia de origen; lo que la
aplicación sirve son las versiones optimizadas de `frontend/public/imagenes/`.

> **Actualizado el 2026-08-15.** Estas cuatro imágenes **están en uso, de forma temporal**,
> por decisión del propietario y conociendo los límites que se detallan abajo. Se
> sustituyen en cuanto haya sesión de fotos con Diego.
>
> | Imagen | Dónde se usa |
> |---|---|
> | Collage colombiano | Fondo del héroe |
> | Acordeón recortado | Portada del curso completo |
> | Ilustración atardecer | Portada de «La gota fría» |
> | Ilustración low-poly | Portada de «Los caminos de la vida» |
>
> El simulador **no** usa ninguna: sigue dibujando su diagrama de botones con CSS y tokens,
> porque ninguna es una captura del producto.

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

## Sus límites, que siguen siendo ciertos

**Son demasiado pequeños.** El mayor tiene 567 px de ancho. Un fondo de héroe necesita unos
2400 px; a este tamaño se ven borrosos en cualquier pantalla moderna. `npm run
imagenes:optimizar` lo avisa en cada ejecución y **no las amplía a propósito**: escalar
cambia el número de píxeles, no el detalle.

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
