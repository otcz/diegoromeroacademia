# ADR 0014 · Iconografía Material Symbols Rounded

**Estado:** aceptado — **sustituye al [ADR 0005](0005-iconografia-phosphor.md)**
**Fecha:** 2026-08-16
**Deciden:** Oscar Tomás Carrillo Zuleta

---

## Contexto

La regla 12 del proyecto pide, textualmente, «iconos profesionales de la biblioteca de Google u
otra igual de profesional». El [ADR 0005](0005-iconografia-phosphor.md) se acogió a la segunda
mitad de esa frase y eligió Phosphor duotone, porque el handoff de diseño ya aprobado lo
especificaba y la landing estaba construida con él. La decisión era razonable con la
información de entonces.

**Al ver las pantallas construidas, el propietario pidió lo que la regla decía en primer lugar:
los iconos de Google, y más grandes.** Esa revisión visual es información que no existía cuando
se escribió el ADR 0005 — se hizo sobre maquetas, no sobre la aplicación funcionando.

Y el diagnóstico coincide con lo que se ve: el duotone de Phosphor lleva una capa rellena al 20 %
detrás del trazo. A 16 px esa capa se convierte en una mancha gris que ensucia el símbolo en vez
de reforzarlo, y el conjunto se lee borroso justo donde más se mira — el menú de cuenta y la
barra lateral, que son los dos sitios por los que se entra a todo lo demás.

## Decisión

**Material Symbols Rounded, peso 400, como única fuente de iconos del proyecto.**

Se toma del paquete `@material-symbols/svg-400` (Apache-2.0), estilo `rounded`, y se compila a
un registro de SVG en línea igual que antes. **No se carga la fuente variable de Google ni
ninguna hoja de estilos remota**: eso significaría una petición a `fonts.googleapis.com` en cada
visita, un punto de fallo externo y un dato de navegación entregado a un tercero. El SVG en
línea entra en el paquete y se tiñe con `currentColor`.

**Rounded y no Outlined ni Sharp.** Sus terminaciones curvas conversan con Bricolage Grotesque,
la tipografía de titulares de la marca. Outlined es el estilo por defecto de Google y arrastra
consigo el aire de «producto de Google»; Sharp es de panel de control. Esta es una academia con
nombre y cara de una persona.

**La escala sube un escalón entera: 20 / 24 / 32 / 40 px** (antes 16 / 20 / 24 / 32), y el
tamaño por defecto pasa de 20 a 24. Material se dibuja sobre una retícula de 24 con trazo de
peso 400 y **no** tiene la capa rellena del duotone, así que al mismo número de píxeles pesa
visualmente menos. Mantener la escala anterior habría entregado iconos más pobres que los de
partida, que es lo contrario de lo que se pidió.

## Alternativas consideradas

| Alternativa | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Material Symbols Rounded, SVG en línea** (elegida) | Es lo que pide la regla 12 en primer lugar; 3.000+ símbolos; Apache-2.0; una sola gramática visual; sin peticiones a terceros | Hay que rehacer el mapa de nombres y revisar los tamaños de las trece pantallas | — |
| Seguir con Phosphor duotone | Cero trabajo; ya estaba aprobado en el handoff | Es justo lo que el propietario revisó y pidió cambiar | La aprobación del handoff se hizo sobre maquetas; la revisión, sobre la aplicación real |
| Material Symbols como fuente variable de Google | Ajuste fino de peso, relleno y grado en tiempo de ejecución; menos peso si se usan muchos iconos | Petición a `fonts.googleapis.com` en cada visita, o autoalojar 4 MB de fuente para usar 64 símbolos; parpadeo hasta que carga | Un tercero en la ruta crítica de cada visita, a cambio de nada que el SVG no dé ya |
| Solo agrandar los de Phosphor | Lo más barato | No resuelve el duotone: agrandar la mancha gris la hace más visible, no menos | Ataca el síntoma y empeora la causa |
| Mezclar: Material en la aplicación, Phosphor en la portada | No se toca la landing aprobada | Dos gramáticas visuales conviviendo — el efecto de «armado por partes» que prohíbe la regla 11 | La portada y la aplicación son el mismo producto y se ven seguidas |

## Consecuencias

**Positivas**

- Los iconos entran limpios a 20 px, que es el tamaño de la mayoría de las filas.
- Apache-2.0, sin restricciones de uso comercial.
- El catálogo de Google cubre casos que Phosphor resolvía a medias.

**Negativas — lo que se acepta pagar**

- **Material Symbols no tiene logotipos de marcas.** Google los retiró de su catálogo. WhatsApp
  y LinkedIn, que entraban por el registro de iconos, pasaron a `disenio/iconos/marcas.ts` y se
  consumen con `<adr-marca>`. Es donde el [ADR 0010](0010-marcas-de-terceros-fuera-del-sistema-de-iconos.md)
  ya decía que debían estar: una marca identifica a su dueño y lleva sus colores, no los
  nuestros. El cambio de librería solo adelantó una corrección pendiente.
- **No hay equivalente literal de algunos símbolos.** El destello de «Consejo de Diego» pasó a
  una bombilla, que además dice mejor lo que ese panel es.
- El handoff de diseño queda desactualizado en su capa de iconografía. Se anota; no se reescribe.

**Reglas que se derivan**

- Tamaños permitidos: **20, 24, 32 y 40 px**. Nada intermedio.
- Se consumen por el componente `<adr-icono>`, nunca pegando un `<svg>` suelto en una plantilla.
- **El registro se genera, no se escribe:** `npm run iconos:generar`. Si el nombre de Google no
  existe, el script falla en vez de dejar un hueco.
- **El mapa de nombres se conserva.** La izquierda es el vocabulario del proyecto y la derecha el
  nombre de Google. Ese desacople es lo que permitió hacer este cambio tocando un archivo en vez
  de cien plantillas, y es lo que permitirá el siguiente.
- **Prohibidos:** emojis, iconos de otras librerías, iconos como imagen de mapa de bits, e
  iconos como único portador de significado (siempre con `aria-label` o texto).

**Qué obligaría a revisar esta decisión**

- Un cambio de identidad visual que reemplace el sistema «Azul rey».
- Que Google cambie la licencia de Material Symbols.
