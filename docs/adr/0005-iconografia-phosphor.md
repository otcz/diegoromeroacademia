# ADR 0005 · Iconografía Phosphor duotone

**Estado:** aceptado
**Fecha:** 2026-08-14
**Deciden:** Oscar Tomás Carrillo Zuleta

---

## Contexto

La regla 12 del proyecto pide iconos «profesionales de la biblioteca de Google u otra igual de
profesional». El handoff de diseño ya aprobado —sistema «Azul rey»— especifica **Phosphor
duotone, SVG inline con `currentColor`**, y la landing de alta fidelidad ya está construida
con ellos.

Hay entonces una tensión aparente entre la regla escrita y el diseño aprobado, y conviene
dejar resuelto por qué se elige uno.

## Decisión

**Phosphor duotone, como única fuente de iconos del proyecto.**

La regla 12 admite explícitamente «u otra igual de profesional». Phosphor lo es: más de 9.000
iconos, seis pesos, licencia MIT y consistencia geométrica. Cumple la regla sin obligar a
retocar un diseño ya aprobado.

## Alternativas consideradas

| Alternativa | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Phosphor duotone** (elegida) | Ya fijada por el diseño aprobado; el peso duotone permite un acento sutil coherente con «Azul rey»; SVG inline se tiñe con `currentColor`; MIT | Menos ubicua que Material | — |
| Google Material Symbols | Mencionada literalmente en la regla 12; fuente variable con peso, relleno y grado configurables | Obligaría a revisar la landing ya aprobada; su lenguaje visual es más «producto de Google» y compite con la identidad de marca personal | El costo de rehacer el diseño aprobado no compra nada |
| Mezclar ambas | Mayor cobertura de iconos | Dos gramáticas visuales conviviendo: es exactamente lo que hace ver una interfaz como armada por partes | Contradice la regla 11 |

## Consecuencias

**Positivas**

- Una sola gramática visual en toda la plataforma.
- `currentColor` hace que el icono herede el color del texto: no hay que definir variantes de
  color por icono, y respeta los tokens automáticamente.
- Licencia MIT, sin restricciones de uso comercial.

**Negativas — lo que se acepta pagar**

- Si algún día falta un icono muy específico, hay que dibujarlo respetando la geometría de
  Phosphor (grilla de 256, trazo de 16 en peso regular) en vez de tomarlo de otra librería.

**Reglas que se derivan**

- Tamaños permitidos: 16, 20, 24 y 32 px. Nada intermedio.
- Se consumen por el componente `<adr-icono>`, nunca pegando un `<svg>` suelto en una plantilla.
- **Prohibidos:** emojis, iconos de otras librerías, iconos como imagen de mapa de bits, e
  iconos como único portador de significado (siempre con `aria-label` o texto).

**Qué obligaría a revisar esta decisión**

- Un cambio de identidad visual que reemplace el sistema «Azul rey».
