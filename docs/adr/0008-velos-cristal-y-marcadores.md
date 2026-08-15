# ADR 0008 · Velos, cristal y marcadores del sistema visual

**Estado:** aceptado
**Fecha:** 2026-08-15
**Deciden:** Oscar Tomás Carrillo Zuleta
**Amplía:** el sistema «Azul rey» de [docs/04](../04-frontend-y-componentes.md)

---

## Contexto

El propietario pidió un rediseño «mucho más profesional», con **transparencia: fotos e
imágenes debajo de capas translúcidas**. Ese efecto necesita valores que el sistema aprobado
no define: opacidades de velo, desenfoque de cristal, y colores de respaldo para cuando el
navegador no soporta `backdrop-filter`.

Tres hechos obligan a decidir esto **antes** de escribir una línea de SCSS:

1. `_tokens.scss` declara en su cabecera que **proponer un valor nuevo requiere un ADR**, y
   `docs/04 §1` lo repite. Sin este documento solo quedan dos salidas malas: escribir valores
   literales —que rompe la regla 15— o renunciar a la transparencia que se pidió.
2. La landing actual **ya incumple la regla 15**: `landing.scss` tiene `rgb(10 19 33 / 88%)`,
   `#1b3557`, `#0e1b2e`, `#dbe6f5` y `#c6d5ea` escritos a mano. Son un defecto pendiente, y no
   se puede apilar un sistema de velos encima de él.
3. El velo del héroe viene del handoff aprobado con la fórmula
   `linear-gradient(100deg, rgba(10,19,33,0.88) 30%, …0.45 65%, …0.1 100%)`. Ese `rgb(10 19 33)`
   **no aparece en ninguna tabla aprobada**: el Noche azul del sistema es `#0E1B2E`, que es
   `rgb(14 27 46)`. El prototipo usó un azul ligeramente distinto, casi seguro por descuido.

Además, no hay ni una foto real de Diego. La página tiene que verse **deliberada** hoy y
absorber fotos después sin tocar plantillas.

## Decisión

Se aprueban **diez tokens nuevos** y **un quinto tinte** para `<adr-etiqueta>`.

### Velos — para texto legible sobre imagen

| Token | Valor | Uso |
|---|---|---|
| `--adr-velo-lateral` | `linear-gradient(100deg, rgb(14 27 46 / 88%) 30%, rgb(14 27 46 / 45%) 65%, rgb(14 27 46 / 10%) 100%)` | Héroe. La fórmula del handoff, **recoloreada sobre el Noche azul aprobado** |
| `--adr-velo-inferior` | `linear-gradient(180deg, rgb(14 27 46 / 0%) 45%, rgb(14 27 46 / 55%) 100%)` | Portadas de curso, para que la etiqueta mango «Nuevo» contraste sobre cualquier foto |

### Cristal esmerilado

| Token | Valor |
|---|---|
| `--adr-cristal-fondo-oscuro` | `rgb(255 255 255 / 6%)` |
| `--adr-cristal-fondo-claro` | `rgb(255 255 255 / 72%)` |
| `--adr-cristal-desenfoque` | `16px` |
| `--adr-cristal-desenfoque-movil` | `8px` |
| `--adr-cristal-respaldo-oscuro` | `color-mix(in srgb, var(--adr-color-blanco) 10%, var(--adr-color-noche-azul))` |
| `--adr-cristal-respaldo-claro` | `var(--adr-color-blanco)` |

### Marcadores — el mecanismo que sustituye a las fotos que faltan

| Token | Valor |
|---|---|
| `--adr-degradado-marcador-oscuro` | `linear-gradient(135deg, color-mix(in srgb, var(--adr-color-azul-profundo) 24%, var(--adr-color-noche-azul)), var(--adr-color-noche-azul) 70%)` |
| `--adr-degradado-marcador-claro` | `linear-gradient(135deg, var(--adr-tinte-azul-fondo), var(--adr-color-pista-barra) 70%)` |

### Quinto tinte de etiqueta

`TinteEtiqueta` pasa de `'azul' | 'mango' | 'verde' | 'neutro'` a incluir `'sobre-oscuro'`.
Los cuatro existentes son tintes claros: sobre la sección Noche azul son ilegibles.

## Alternativas consideradas

| Alternativa | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Tokens del sistema** (elegida) | Un solo sitio define la transparencia; cambiarla es cambiar un valor; ArchUnit del diseño —la revisión— puede exigir que no haya literales | Requiere este documento | — |
| Valores literales en cada componente | Rápido | Rompe la regla 15 y garantiza deriva: el tercer velo ya no coincidirá con el primero | Es exactamente el fallo que el sistema de tokens existe para evitar |
| Conservar el `rgb(10,19,33)` del prototipo | Fidelidad literal al handoff | Introduce un quinto azul no declarado en la paleta, invisible al ojo pero real en el código | Un color fuera de la tabla aprobada es una grieta por donde entran los demás |
| `background-image` + `image-set()` apuntando a archivos que no existen | Degradación «automática» | Una petición fallida por hueco en cada carga, error en consola, penalización en auditoría, e imposible de probar | La degradación se decide por entrada (`fuente: string \| null`), no por 404 |
| Rotación de matiz por índice para las portadas | Variedad sin esfuerzo | Fabrica colores fuera de la paleta por construcción | Automatiza la deriva cromática, que es lo peor que puede hacer un sistema de diseño |

## Consecuencias

**Positivas**

- La transparencia queda encapsulada en `<adr-panel-cristal>` y `<adr-marco-imagen>`. Ninguna
  pantalla vuelve a escribir un `backdrop-filter`, con su respaldo `@supports` y su apagado
  bajo `prefers-reduced-transparency`.
- La página funciona **hoy** sin una sola foto, y absorbe fotos después cambiando cinco nulos
  en un manifiesto.
- Se corrige de paso el incumplimiento vigente de la regla 15 en `landing.scss`.

**Negativas — lo que se acepta pagar**

- `backdrop-filter` cuesta en GPU. Se acota con un presupuesto explícito: **máximo dos
  superficies con desenfoque en toda la página**, blur reducido bajo 768 px, respaldo macizo
  sin soporte, y apagado si el sistema pide menos transparencia. **Si el LCP en móvil sube más
  de 200 ms respecto de la landing actual, el cristal del héroe pasa a superficie maciza.**
  El gusto estético no puede costar conversión en el dispositivo mayoritario.
- El velo del héroe deja de coincidir *al bit* con el prototipo. Es deliberado: gana la tabla
  de color aprobada.

**Qué obligaría a revisar esta decisión**

- Que el presupuesto de rendimiento se incumpla en un móvil real.
- Un cambio de identidad visual que reemplace «Azul rey».
