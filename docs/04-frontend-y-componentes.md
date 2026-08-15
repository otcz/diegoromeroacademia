# 04 · Sistema visual y catálogo de componentes

**Cubre las reglas 11, 12 y 15 del proyecto.**

El sistema visual **«Azul rey»** está aprobado. Los valores de esta página son finales: no se
proponen colores, tamaños ni radios nuevos sin un ADR. La landing pública ya está diseñada en
alta fidelidad y se recrea en Angular píxel a píxel.

Fuente: handoff de diseño (`Landing Azul.dc.html`, tablero «2b Azul rey»).

---

## 1. Tokens

**Ningún valor literal en un componente.** Todo color, tamaño, radio y sombra se consume como
variable CSS. Un `#1D6BF3` escrito a mano en un `.scss` es un defecto de revisión.

Los tokens viven en `frontend/src/app/disenio/_tokens.scss` y se exponen como propiedades
personalizadas con prefijo `--adr-`.

### Color

```scss
:root {
  /* Superficies */
  --adr-color-niebla:            #F6F8FB;  /* fondo de página */
  --adr-color-blanco:            #FFFFFF;  /* tarjetas */
  --adr-color-noche-azul:        #0E1B2E;  /* héroe, simulador, pie */

  /* Texto */
  --adr-color-tinta:             #16212E;  /* texto principal */
  --adr-color-texto-secundario:  #4A5A6E;  /* párrafos sobre claro */
  --adr-color-texto-atenuado:    #6E7E92;  /* metadatos, captions */

  /* Acción */
  --adr-color-azul-rey:          #1D6BF3;  /* ÚNICA tinta de acción */
  --adr-color-azul-profundo:     #1552C4;  /* hover, enlaces de texto */

  /* Acento y estado */
  --adr-color-mango:             #FFB01F;  /* solo chispa, NUNCA botones */
  --adr-color-exito:             #1F9D66;  /* progreso, aprobado */
  --adr-color-whatsapp:          #25D366;
  --adr-color-whatsapp-hover:    #1DA851;

  /* Bordes */
  --adr-color-borde-divisor:     #DCE3EC;
  --adr-color-borde-suave:       #C0CBD9;

  /* Tintes de etiqueta: fondo / texto */
  --adr-tinte-azul-fondo:        #E3EDFE;
  --adr-tinte-azul-texto:        #134BB8;
  --adr-tinte-mango-fondo:       #FFF3D6;
  --adr-tinte-mango-texto:       #8A5F04;
  --adr-tinte-verde-fondo:       #DFF0E8;
  --adr-tinte-verde-texto:       #17603F;
  --adr-color-pista-barra:       #E4EAF2;

  /* Sobre fondo oscuro */
  --adr-oscuro-texto-fuerte:     rgba(255,255,255,0.85);
  --adr-oscuro-texto-suave:      rgba(255,255,255,0.65);
  --adr-oscuro-borde:            rgba(255,255,255,0.12);
  --adr-oscuro-borde-fuerte:     rgba(255,255,255,0.40);
}
```

### Las cuatro reglas de color

1. **El azul rey es la única tinta de acción.** Si algo se puede clicar, es azul.
2. **El mango nunca va en un botón.** Solo subrayados, estrellas de dificultad y etiquetas
   «Nuevo» / «Recomendado».
3. **El verde solo comunica progreso o aprobación.** Nunca es decorativo.
4. **Las secciones alternan Niebla y Noche azul** para dar ritmo: héroe, simulador y pie
   oscuros; el resto claro.

### Tipografía

Dos familias de Google Fonts, sin excepciones.

```scss
--adr-fuente-titular: 'Bricolage Grotesque', system-ui, sans-serif;  /* 800 display, 700 títulos */
--adr-fuente-cuerpo:  'Instrument Sans', system-ui, sans-serif;      /* 400 cuerpo, 500 nav, 600 botones */
```

| Rol | Tamaño | Familia / peso | Detalle |
|---|---|---|---|
| Display (héroe) | 64px | Titular 800 | `letter-spacing: -0.02em`, `line-height: 1.02` |
| Título de sección | 40–42px | Titular 800 | `letter-spacing: -0.015em` |
| Cifra / precio | 30–36px | Titular 700 | |
| Título de tarjeta | 20px | Titular 700 | |
| Cuerpo | 15–18px | Cuerpo 400 | `line-height: 1.6` |
| Navegación | 15px | Cuerpo 500 | |
| Botón / etiqueta | 15–16px | Cuerpo 600 | |
| Caption / kicker | 11–13px | Cuerpo 600 | MAYÚSCULAS, `letter-spacing: 0.1–0.16em` |

**Gesto de marca — subrayado mango.** Se aplica a la palabra clave de un titular, sobre un
`<span>`:

```scss
background: linear-gradient(180deg, transparent 76%, rgba(255,176,31,0.95) 76%);
```

Se usa **una vez por pantalla como máximo**. Repetido pierde todo su efecto.

### Forma, sombra, espaciado

```scss
--adr-radio-tarjeta:        16px;
--adr-radio-tarjeta-curso:  14px;
--adr-radio-pastilla:       999px;   /* todos los botones y etiquetas */

--adr-sombra-tarjeta:       0 2px 12px rgba(14,27,46,0.06);
--adr-sombra-tarjeta-alta:  0 2px 12px rgba(14,27,46,0.08);
--adr-sombra-destacado:     0 8px 28px rgba(29,107,243,0.18);
--adr-sombra-flotante:      0 6px 20px rgba(14,27,46,0.25);

--adr-contenedor-max:       1200px;
--adr-contenedor-padding:   48px;
--adr-separacion-seccion:   88px;
```

**Escala de espaciado** (base 4px — derivada del diseño aprobado, no explícita en el handoff):
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 88`. No se usan valores fuera de la escala.

---

## 2. Iconografía

**Phosphor duotone, exclusivamente** (regla 12, ADR 0005).

- SVG **inline**, con `fill="currentColor"` — el icono se tiñe solo con el color del texto y
  respeta el tema sin código extra.
- Tamaños permitidos: **16 · 20 · 24 · 32 px**. Nada intermedio.
- Se consumen siempre por el componente `<adr-icono nombre="lock" tamanio="20">`, nunca
  pegando un `<svg>` suelto en una plantilla.
- Los iconos usados se registran en `frontend/src/app/disenio/iconos/`, para que el bundle
  incluya solo los que existen.

**Prohibido:** emojis, iconos de otra librería, iconos como imagen `.png`, e iconos como único
portador de significado (siempre `aria-label` o texto acompañante).

---

## 3. Catálogo de componentes

**Regla 11: ninguna pantalla crea su propio botón, modal, panel o tarjeta.** Todo sale de
`frontend/src/app/compartido/componentes/`. Si una pantalla necesita algo que no está aquí, se
agrega al catálogo — no se improvisa localmente.

### Base

| Componente | Selector | Variantes / estados |
|---|---|---|
| Botón | `<adr-boton>` | `primario`, `secundario`, `fantasma`, `sobre-oscuro`, `peligro` · estados: normal, hover, foco, activo, deshabilitado, cargando |
| Icono | `<adr-icono>` | Phosphor duotone, 16/20/24/32 |
| Etiqueta | `<adr-etiqueta>` | Tintes: azul, mango, verde, neutro |
| Tarjeta | `<adr-tarjeta>` | Con y sin encabezado, con y sin pie |
| Campo de texto | `<adr-campo>` | Rótulo, ayuda, error, requerido, deshabilitado |
| Selector | `<adr-select>` | Mismos estados que campo |
| Casilla / interruptor | `<adr-casilla>`, `<adr-interruptor>` | |
| Barra de progreso | `<adr-barra-progreso>` | Pista `--adr-color-pista-barra`, relleno verde, radio 999 |
| Avatar | `<adr-avatar>` | Iniciales o foto |
| Alerta | `<adr-alerta>` | `informacion`, `exito`, `advertencia`, `error` |
| Tabla | `<adr-tabla>` | Ordenable, con paginador |
| Paginador | `<adr-paginador>` | |
| Pestañas | `<adr-pestanias>` | |
| Migas de pan | `<adr-migas>` | |

### Estructurales

| Componente | Selector | Nota |
|---|---|---|
| Modal | `<adr-modal>` | Anatomía fija, ver §4 |
| Panel lateral | `<adr-panel-lateral>` | Anatomía fija, ver §4 |
| Estado vacío | `<adr-estado-vacio>` | Icono + título + explicación + acción |
| Cargando | `<adr-esqueleto>` | Esqueleto, **nunca un spinner a pantalla completa** |
| Confirmación | `<adr-confirmacion>` | Modal preconfigurado para acciones destructivas |

### De dominio

| Componente | Selector | Nota |
|---|---|---|
| Tarjeta de curso | `<adr-tarjeta-curso>` | Foto 170px, progreso, radio 14px |
| Tarjeta de plan | `<adr-tarjeta-plan>` | Variante destacada: borde azul 2px + `--adr-sombra-destacado` + etiqueta mango flotante a -13px |
| Ítem de nivel | `<adr-item-nivel>` | Estados: `completado`, `actual`, `bloqueado` (candado Phosphor) |
| Ítem de clase | `<adr-item-clase>` | Marca de vista con check verde |
| Estrellas de dificultad | `<adr-dificultad>` | Estrellas mango sobre 5 |
| Botón flotante de WhatsApp | `<adr-whatsapp-flotante>` | Fijo abajo-derecha, mensaje precargado |

---

## 4. Anatomía fija de modales y paneles

Esta sección es el corazón de la regla 11. Los modales desalineados son el síntoma más visible
de una interfaz construida por partes, y con IA aparecen rapidísimo si no hay una anatomía
escrita.

### Modal — `<adr-modal>`

```
┌──────────────────────────────────────────┐
│  Título (Titular 700, 20px)         [×]  │  ← encabezado: padding 24px, borde inferior divisor
├──────────────────────────────────────────┤
│                                          │
│  Contenido (padding 24px)                │  ← cuerpo: única zona con scroll, máx 60vh
│                                          │
├──────────────────────────────────────────┤
│                  [Cancelar] [Confirmar]  │  ← pie: padding 24px, borde superior, acciones a la derecha
└──────────────────────────────────────────┘
```

| Aspecto | Valor |
|---|---|
| Anchos | `sm` 420px · `md` 560px · `lg` 760px. Nada intermedio |
| Radio | `--adr-radio-tarjeta` (16px) |
| Velo | `rgba(14,27,46,0.5)` |
| Sombra | `--adr-sombra-flotante` |
| Orden de acciones | Secundaria a la izquierda, **primaria siempre a la derecha** |
| Móvil (<768px) | Ocupa el ancho completo y se ancla abajo, radio solo arriba |
| Teclado | `Esc` cierra · foco atrapado dentro · al cerrar el foco vuelve al elemento que lo abrió |
| Anidamiento | **Prohibido.** Un modal nunca abre otro modal |

### Panel lateral — `<adr-panel-lateral>`

Misma anatomía de tres zonas que el modal. Entra desde la derecha, 420px en escritorio, ancho
completo en móvil. Se usa para formularios largos y detalles del panel de administración;
el modal se reserva para decisiones cortas.

### Los cuatro estados obligatorios

**Toda pantalla que carga datos implementa los cuatro.** Una pantalla sin estado vacío o sin
estado de error está incompleta y no pasa revisión:

1. **Cargando** — esqueleto con la forma del contenido real, nunca un spinner suelto.
2. **Vacío** — `<adr-estado-vacio>` con icono, explicación y la acción que corresponda.
3. **Error** — mensaje comprensible y botón de reintentar. Nunca un código técnico crudo.
4. **Sin permiso** — explica qué falta (suscripción vencida, nivel bloqueado) y ofrece la
   salida (renovar, ir al examen pendiente).

---

## 5. Accesibilidad

No es un extra: gran parte de la audiencia llega desde YouTube en celulares modestos.

- Contraste **WCAG AA** mínimo (4.5:1 en texto normal, 3:1 en texto grande). La combinación
  mango sobre blanco **no cumple** para texto: el mango es acento, no texto.
- **Anillo de foco visible siempre**: 2px azul rey con 2px de separación. No se elimina el
  `outline` sin reemplazarlo.
- Objetivos táctiles **≥ 48×48px** (coincide con la altura estándar de botón).
- Todo icono sin texto lleva `aria-label`.
- El color **nunca** es el único portador de significado: el estado «aprobado» lleva icono y
  texto, no solo verde.
- Navegación completa por teclado, orden de tabulación lógico.
- Modales y paneles con `role="dialog"` y `aria-modal="true"`.

---

## 6. Responsive

**Mobile first** — la mayoría del tráfico llega desde YouTube en celular (especificación §14.1).

| Punto de quiebre | Comportamiento |
|---|---|
| `<768px` | Una columna. Los grids de 3 y 4 colapsan. Menú colapsable. Modales anclados abajo |
| `768–1199px` | Dos columnas. Contenedor fluido con padding lateral 24px |
| `≥1200px` | Diseño completo. Contenedor 1200px, padding lateral 48px |

El botón flotante de WhatsApp está **siempre visible**, en todos los tamaños.

---

## 7. Activos

- **Fotos:** hacen falta fotos reales de Diego (héroe 4:5 y apaisada), capturas del simulador
  y fotos por curso. Mientras no existan, se usan marcadores de posición —
  **nunca ilustraciones genéricas de banco de imágenes**, que destruyen la credibilidad de
  una marca personal.
- **Logo:** wordmark tipográfico «Diego Romero / ACADEMIA». No hay logo gráfico todavía;
  depende de la verificación de marca en la SIC (pendiente #7).
- Toda imagen se sirve en formato moderno, con `width`/`height` declarados para evitar saltos
  de diseño, y con carga diferida fuera del primer pliegue.
