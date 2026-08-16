# ADR 0011 · La paleta oscura del handoff de acceso pasa a ser la del sistema

**Estado:** aceptado
**Fecha:** 2026-08-16
**Deciden:** Oscar Tomás Carrillo Zuleta

---

## Contexto

El handoff del rediseño del login trae su propia escala de oscuros: una base `#080614` con
matiz violeta, un degradado de panel `#0b0820 → #0a0f2c`, un halo azul, dos velos de fundido,
un enlace aclarado para fondo oscuro, un par de foco, superficie de campo y un rojo de error
propio.

El sistema «Azul rey» tenía **un solo** oscuro, `--adr-color-noche-azul: #0e1b2e`, y ningún
token para lo demás. La pantalla de acceso arrancó con esos valores como propiedades locales,
declarados en su propio `.scss` — con la nota de que subirlos repintaría la landing entera.

El propietario decidió que los suba: quiere una sola paleta, no una para el login y otra para
el resto.

## Decisión

**La escala oscura del handoff pasa a `_tokens.scss` y `--adr-color-noche-azul` se repunta a
`#080614`.** La pantalla de acceso deja de declarar colores propios y consume los tokens como
cualquier otra.

Se adopta la escala completa **menos un valor**: el handoff da `rgba(255,255,255,.60)` para el
texto secundario sobre oscuro y el sistema ya usaba `.65`. Se conserva el `.65`. Es la misma
jerarquía visual y se lee mejor; bajarlo solo para igualar un número de la maqueta no compra
nada y resta legibilidad.

El **azul rey se queda** como tinta de acción (regla de color 1). Los azules del handoff
—`#1273d4` y `#2f66f5`— entran como los dos extremos de un degradado de llamada a la acción,
que es un tratamiento, no una tinta nueva.

## Alternativas consideradas

| Alternativa | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Subirla al sistema** (elegida) | Una sola paleta; el login deja de ser una excepción; los huecos que el sistema no tenía —foco, campo sobre oscuro, error sobre oscuro— quedan cubiertos | Repinta las secciones oscuras de la landing | — |
| Dejarla local en `acceso.scss` | Cero riesgo para la landing | Dos oscuros distintos en el mismo sitio, y la siguiente pantalla oscura vuelve a copiarlos a mano | Es como empiezan a divergir las paletas |
| Adoptar solo los tokens que faltaban | Sin cambio visible | El nuevo `#080614` y el viejo `#0e1b2e` conviven; el problema se queda igual | Media medida |

## Consecuencias

**Positivas**

- El fondo nuevo es **más oscuro** que el anterior, así que todo el texto claro que va encima
  **gana** contraste. Medido antes y después sobre la portada: 41 textos en secciones oscuras,
  **0 fallos en ambos casos**, y el peor caso sigue siendo el mismo — «Registrarme», 4,72:1,
  que es blanco sobre azul rey y no depende del fondo. Ninguna medida del [ADR 0009](0009-contraste-aa-de-las-tintas-de-texto.md)
  empeora.
- El sistema gana los tokens que le faltaban y que las pantallas estaban improvisando con
  `rgb()` a mano: tercer escalón de texto sobre oscuro, superficie de campo, anillo de foco y
  rojo de error legible sobre oscuro.

**Negativas — lo que se acepta pagar**

- El héroe, el pie y las secciones oscuras de la landing cambian de tono: de azul marino a un
  negro con matiz violeta. Es un cambio visible y deliberado.
- Los velos del [ADR 0008](0008-velos-cristal-y-marcadores.md) siguen escritos sobre
  `rgb(14 27 46)`, el azul anterior. Funcionan —son degradados sobre foto— pero ya no son el
  mismo color que la superficie. **Pendiente de revisar** cuando se toque el marco de imagen.

**Qué obligaría a revisar esta decisión**

- Que el propietario quiera volver al azul marino en la landing y dejar el violeta solo en las
  pantallas de sesión.
- Que aparezca una pantalla clara con un componente que dé por hecho el oscuro anterior.

## Nota de implementación

El nombre `--adr-velo-*` ya estaba tomado por los degradados de tres paradas del ADR 0008.
Los fundidos planos del handoff entran como `--adr-scrim-*`. Reutilizar el nombre habría hecho
que la segunda definición pisara a la primera **en silencio**: en CSS gana la última y no hay
error que lo avise.
