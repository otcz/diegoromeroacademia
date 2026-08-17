# 04 · Sistema visual y catálogo de componentes

**Cubre las reglas 11, 12 y 15 del proyecto.**

El sistema visual **«Azul rey»** está aprobado. Los valores de esta página son finales: no se
proponen colores, tamaños ni radios nuevos sin un ADR.

Fuentes: handoff de la portada (`docs/handoff-disenio`, tablero «2b Azul rey») y handoff de la
aplicación del estudiante (`docs/handoff-disenio/app-estudiante`). Los dos están recreados en
Angular; lo que se apartó de cada maqueta, y por qué, está en el LEEME de cada carpeta.

---

## 1. Tokens

**Ningún valor literal en un componente.** Todo color, tamaño, radio y sombra se consume como
variable CSS. Un `#1D6BF3` escrito a mano en un `.scss` es un defecto de revisión.

Los tokens viven en `frontend/src/app/disenio/_tokens.scss` y se exponen como propiedades
personalizadas con prefijo `--adr-`.

### La paleta — nombres de COLOR, valores fijos

Esta capa **no cambia con el tema**. Es la materia prima.

```scss
:root {
  /* Superficies */
  --adr-color-niebla:            #F6F8FB;  /* fondo claro */
  --adr-color-blanco:            #FFFFFF;
  --adr-color-noche-azul:        #080614;  /* ADR 0011: era #0E1B2E */

  /* Texto — la tinta también es el RELLENO del botón secundario, por eso sigue fija */
  --adr-color-tinta:             #16212E;

  /* Acción */
  --adr-color-azul-rey:          #1D6BF3;  /* ÚNICA tinta de acción */
  --adr-color-azul-profundo:     #1552C4;  /* hover */
  --adr-color-azul-cta-a/-b:     #1273D4 / #2F66F5;  /* degradado de CTA */
  --adr-color-enlace-oscuro:     #7FA9FF;  /* enlace sobre oscuro */

  /* Foco — un solo par para toda la aplicación, igual en ambos temas */
  --adr-color-foco:              #3B82F6;
  --adr-anillo-foco:             0 0 0 4px rgba(59,130,246,0.18);

  /* Acento y estado */
  --adr-color-mango:             #FFB01F;  /* solo chispa, NUNCA botones */
  --adr-color-exito:             #1F9D66;  /* progreso, aprobado */
  --adr-color-whatsapp:          #25D366;  /* hover #1DA851 */

  /* Sobre superficies oscuras en AMBOS temas: reproductor, tarjeta de regalo, héroe */
  --adr-oscuro-texto-fuerte:     rgba(255,255,255,0.85);
  --adr-oscuro-texto-suave:      rgba(255,255,255,0.65);
  --adr-oscuro-borde:            rgba(255,255,255,0.12);
  --adr-oscuro-borde-fuerte:     rgba(255,255,255,0.40);
}
```

Los nombres que aquí figuraban con valor literal y hoy son **alias de la capa semántica**
—`--adr-color-texto-secundario`, `--adr-color-texto-atenuado`, `--adr-color-borde-divisor`,
`--adr-color-borde-suave`, `--adr-color-pista-barra`, `--adr-sombra-tarjeta` y los
`--adr-tinte-*`— están en la tabla de abajo. Ya nombraban un papel, no un color.

### La capa semántica — es la que consume una pantalla

Desde el [ADR 0012](adr/0012-doble-tema-en-todo-el-sitio.md), `_tokens.scss` tiene **dos capas**:

- **Paleta** (`--adr-color-*`): nombres de COLOR. Valores fijos, no cambian con el tema.
- **Semántica**: nombres de PAPEL. **Conmutan** con `data-theme`.

**Una pantalla consume la capa semántica.** Escribir `--adr-color-niebla` en un componente lo
deja clavado en claro, y eso es lo que produce un tema oscuro a medias: la mitad de la interfaz
obedece al interruptor y la otra mitad no. La paleta se usa solo donde el color **es** el
mensaje — el mango del subrayado, el verde de WhatsApp, los colores de Google, el papel del
certificado y las superficies oscuras en ambos temas (el reproductor, la tarjeta de regalo).

| Papel | Token | Claro | Oscuro |
|---|---|---|---|
| Fondo de página | `--adr-fondo` | `#F6F8FB` | `#080614` |
| Cara de tarjeta | `--adr-superficie` | `#FFFFFF` | blanco 4 % |
| Segunda superficie | `--adr-superficie-2` | `#FAFBFF` | blanco 3 % |
| Sombra de tarjeta | `--adr-sombra-superficie` | `0 1px 3px …` | **ninguna** |
| Relleno sutil | `--adr-relleno-1..3`, `--adr-relleno-hover` | grises fríos | velos de blanco |
| Divisor | `--adr-linea` | `#E4E7F2` | blanco 7 % |
| Borde | `--adr-borde`, `--adr-borde-tenue`, `--adr-borde-fuerte` | `#E4E7F2`… | blanco 6–16 % |
| Texto 1–5 | `--adr-texto-1` … `--adr-texto-5` | `#0E1230` → `#5F6F86` | blanco 100 % → 50 % |
| Enlace | `--adr-enlace`, `--adr-enlace-hover` | `#1D4FD7` | `#7FA9FF` |
| Estado | `--adr-estado-{azul,verde,dorado,rojo,morado}-{fondo,borde,texto,icono}` | tintes claros | velos sobre oscuro |
| Banda de ritmo | `--adr-fondo-banda`, `--adr-banda-filo` | noche azul, sin filo | degradado levantado + filo |

**La banda de ritmo se invierte, no se traduce.** Es lo que parte la portada en capítulos
(regla de color 4). En claro es una banda MÁS OSCURA que la página; en oscuro, MÁS CLARA. Lo
que se conserva es el contraste, no el color — y la razón está en la corrección del
[ADR 0012](adr/0012-doble-tema-en-todo-el-sitio.md), que documenta cómo llegó a cancelarse.

**Cinco escalones de texto, no once.** El handoff trae once y siete de borde; se condensaron.
Once niveles no son una jerarquía: nadie distingue `.72` de `.70` y el segundo acaba usándose por
accidente. Una prueba verifica que los cinco bajan de contraste en orden, en ambos temas.

**Los nombres anteriores son alias.** `--adr-color-tinta`, `--adr-color-borde-divisor`,
`--adr-color-pista-barra`, `--adr-sombra-tarjeta` y los tintes de etiqueta **apuntan** a la capa
semántica. Siguen funcionando; **no se usan en código nuevo**.

**El contraste está probado, no revisado a ojo.** `disenio/contraste.spec.ts` mide cada escalón
sobre cada superficie donde se usa, compuesto sobre su pila real, en los dos temas. El mínimo es
el 4,5:1 de §5 y la medida más justa hoy es 4,54.

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

/* --adr-sombra-tarjeta y -alta son ALIAS de --adr-sombra-superficie: en oscuro no hay
   sombra que dar, porque no hay luz que bloquear. */
--adr-sombra-destacado:     0 8px 28px rgba(29,107,243,0.18);
--adr-sombra-flotante:      0 6px 20px rgba(14,27,46,0.25);
--adr-sombra-cta:           0 8px 18px rgba(18,115,212,0.30);

--adr-contenedor-max:       1200px;
--adr-contenedor-padding:   48px;
--adr-separacion-seccion:   88px;
```

**Escala de espaciado** (base 4px — derivada del diseño aprobado, no explícita en el handoff):
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 88`. No se usan valores fuera de la escala.

**Medidas de la aplicación del estudiante** (estructura, no color: no cambian con el tema):
barra lateral 246px · riel de tableta 84px · barra inferior 76px · panel del carrito 384px ·
simulador vertical 236px.

---

## 2. Iconografía

**Material Symbols Rounded, peso 400, exclusivamente** (regla 12,
[ADR 0014](adr/0014-iconografia-material-symbols.md), que sustituye al 0005).

- SVG **inline** desde `@material-symbols/svg-400`, con `fill="currentColor"` — el icono se
  tiñe solo con el color del texto y respeta el tema sin código extra. **No se carga la fuente
  variable de Google**: sería una petición a un tercero en cada visita.
- Tamaños permitidos: **20 · 24 · 32 · 40 px**. Nada intermedio. El defecto es 24.
- Se consumen siempre por el componente `<adr-icono nombre="lock" [tamanio]="20">`, nunca
  pegando un `<svg>` suelto en una plantilla.
- El registro se **genera**: `npm run iconos:generar` lee el mapa de
  `scripts/generar-iconos.mjs` y escribe `disenio/iconos/registro-iconos.ts`. Nunca se edita a
  mano, y solo entra al paquete lo que está en la lista.

**El mapa tiene dos columnas y eso es deliberado.** A la izquierda, el nombre del proyecto
—`caret-down`, `magnifying-glass`— que es lo que escriben las plantillas. A la derecha, el de
Google —`keyboard_arrow_down`, `search`—. Ese desacople es lo que permitió cambiar toda la
librería tocando un archivo en vez de las cien plantillas que consumen iconos.

**Prohibido:** emojis, iconos de otra librería, iconos como imagen `.png`, e iconos como único
portador de significado (siempre `aria-label` o texto acompañante).

### Marcas de terceros — no son iconos (ADR 0010)

Un icono **comunica una idea** y es nuestro. Una marca **identifica a su titular** y no lo es:
Google exige su «G» de cuatro colores sin recolorear en cualquier botón de ingreso, y teñirla
con `currentColor` incumple su norma además de delatar la pantalla como poco fiable.

- Viven en `frontend/src/app/disenio/iconos/marcas.ts`, **escritas a mano**. No pasan por
  `npm run iconos:generar`.
- Se consumen por `<adr-marca nombre="google">`, nunca por `<adr-icono>`.
- Es el **único** sitio del proyecto donde se escriben colores literales (excepción a la
  regla 15): esos colores no son de nuestra paleta.
- Cada marca declara a su `titular`, para poder rendir cuentas de las marcas ajenas usadas.
- En botón se usan siempre con la variante `proveedor`, que no invierte al pasar el ratón.

### Esquema de color

Aquí decía que `global.scss` declaraba `color-scheme: only light` para renunciar al **tema
oscuro automático de Chrome** —el que invierte la paleta por su cuenta— y que la línea cambiaría
«el día que exista un modo oscuro propio». Ese día es el [ADR 0012](adr/0012-doble-tema-en-todo-el-sitio.md).

Ahora `color-scheme` lo fija **cada tema** en `_tokens.scss`: `light` en `:root` y `dark` en
`[data-theme='oscuro']`. El navegador siempre recibe un esquema explícito, así que nunca se
inventa uno, y el nuestro está diseñado y medido.

### Equivalencia de iconos con el handoff de la aplicación

El handoff de la app dibuja iconos de trazo tipo Lucide de 13 a 20 px. **Gana la regla 12**: se
traducen a su equivalente de Material Symbols y a los tamaños permitidos. El resultado no es
idéntico a la maqueta, y es deliberado — mezclar dos librerías se nota inmediatamente aunque
nadie sepa decir por qué. La lista completa está en `scripts/generar-iconos.mjs`; una muestra:

| Handoff | Nombre del proyecto | Material Symbols |
|---|---|---|
| casa | `house` | `home` |
| birrete / libro | `graduation-cap` | `school` |
| pesas | `barbell` | `fitness_center` |
| bolsa de tienda | `storefront` | `storefront` |
| play en círculo | `play-circle` · `play` · `pause` | `play_circle` · `play_arrow` · `pause` |
| retroceder / avanzar 15 s | `rewind` · `fast-forward` | `fast_rewind` · `fast_forward` |
| pantalla completa | `corners-out` · `corners-in` | `fullscreen` · `fullscreen_exit` |
| subtítulos | `closed-captioning` | `closed_caption` |
| velocidad | `sliders-horizontal` | `tune` |
| regalo | `gift` | `redeem` |
| llama de racha | `fire` | `local_fire_department` |
| diana del reto | `target` | `target` |

**Dos casos donde Material no tiene equivalente literal**, y por qué se resolvieron así:

| Antes | Ahora | Por qué |
|---|---|---|
| `whatsapp-logo`, `linkedin-logo` | `<adr-marca>` | Google retiró las marcas de su catálogo. Y una marca no era un icono desde el principio: es lo que ya decía el [ADR 0010](adr/0010-marcas-de-terceros-fuera-del-sistema-de-iconos.md) |
| `sparkle` en «Consejo de Diego» | `lightbulb` | El destello era decoración; la bombilla dice que eso es una idea útil |

---

## 3. Catálogo de componentes

**Regla 11: ninguna pantalla crea su propio botón, modal, panel o tarjeta.** Todo sale de
`frontend/src/app/compartido/componentes/`. Si una pantalla necesita algo que no está aquí, se
agrega al catálogo — no se improvisa localmente.

### Base

| Componente | Selector | Variantes / estados |
|---|---|---|
| Botón | `<adr-boton>` | `primario`, `secundario`, `proveedor`, `fantasma`, `sobre-oscuro`, `peligro` · estados: normal, hover, foco, activo, deshabilitado, cargando |
| Icono | `<adr-icono>` | Material Symbols Rounded, 20/24/32/40 |
| Marca de tercero | `<adr-marca>` | `google`, `facebook`, `whatsapp`, `linkedin`, `tiktok`, `instagram`, `youtube` — colores del titular, ADR 0010 |
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
| Ítem de nivel | `<adr-item-nivel>` | Estados: `completado`, `actual`, `bloqueado` (candado de Material Symbols) |
| Ítem de clase | `<adr-item-clase>` | Marca de vista con check verde |
| Estrellas de dificultad | `<adr-dificultad>` | Estrellas mango sobre 5 |
| Botón flotante de WhatsApp | `<adr-whatsapp-flotante>` | Fijo abajo-derecha, mensaje precargado |

### De la aplicación del estudiante

Del handoff `docs/handoff-disenio/app-estudiante`. Ver
[ADR 0013](adr/0013-rutas-de-la-aplicacion-del-estudiante.md).

| Componente | Selector | Nota |
|---|---|---|
| Pastilla de filtro | `<adr-chip>` | `<button>` con `aria-pressed`. Nunca un `div` con `click` |
| Interruptor | `<adr-interruptor>` | `role="switch"` + `aria-checked`. Etiqueta obligatoria |
| Estado vacío | `<adr-estado-vacio>` | La acción va por contenido proyectado, no por entradas |
| Mosaico de cifra | `<adr-mosaico-cifra>` | Número y complemento separados; cifras tabulares |
| Ítem de lista | `<adr-item-lista>` | Cuatro estados con cuatro FORMAS, no cuatro colores |
| Tarjeta de tutorial | `<adr-tarjeta-tutorial>` | La acción depende de si está comprado |
| Tarjeta de ejercicio | `<adr-tarjeta-ejercicio>` | BPM primero: es lo que dice si está a tu alcance |
| Tarjeta de producto | `<adr-tarjeta-producto>` | Añadir + regalar. El botón dice cuántos hay en el carrito |
| Línea de carrito | `<adr-linea-carrito>` | Emite el delta; no toca el carrito |
| Tarjeta de regalo | `<adr-tarjeta-regalo>` | Vista previa en vivo; oscura en ambos temas |
| Reproductor | `<adr-reproductor>` | 16:9 con tope. Modos `clase`, `tutorial`, `ejercicio` |
| Simulador de pisadas | `<adr-simulador-pisadas>` | 10/11/10 pitos + 12 bajos. Lectura textual obligatoria |

**Piezas de clase, no componentes** (`disenio/_paneles.scss`): `.adr-panel` y su cabecera,
`.adr-panel__pastilla`, `.adr-tabla`, `.adr-cabecera`, `.adr-volver`, `.adr-filtros`,
`.adr-rejilla`. Son forma sin comportamiento ni estado; un `<adr-panel>` con seis entradas para
cubrir los casos sería más código para menos libertad.

### Armazón — `compartido/disposicion/`

`<adr-shell>` compone barra lateral (246 px), barra superior pegajosa, contenido, navegación
inferior de móvil (76 px, 5 pestañas) y panel del carrito (384 px). Es el componente de una ruta
padre, así que hay **una sola instancia** para las trece pantallas: al navegar no se recrea el
menú ni se cierra el carrito.

Las tres disposiciones son la MISMA marca con reglas de ancho distintas, no tres plantillas: con
plantillas separadas por dispositivo, el arreglo que se hace en una no llega a las otras.

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

**Portada y páginas públicas:**

| Punto de quiebre | Comportamiento |
|---|---|
| `<768px` | Una columna. Los grids de 3 y 4 colapsan. Menú colapsable. Modales anclados abajo |
| `768–1199px` | Dos columnas. Contenedor fluido con padding lateral 24px |
| `≥1200px` | Diseño completo. Contenedor 1200px, padding lateral 48px |

El botón flotante de WhatsApp está **siempre visible**, en todos los tamaños.

**Aplicación del estudiante** (del handoff, verificados en su prototipo):

| Punto de quiebre | Qué cambia |
|---|---|
| `≥1460px` y alto `≥760px` | Barra lateral + simulador **vertical** flotando junto al vídeo |
| `1024–1459px` | Barra lateral + simulador en **franja horizontal** |
| `<1024px` | Barra lateral oculta → **barra inferior**; el contenido deja 76px abajo |
| `<1100px` | Las columnas laterales de clase, tutorial y ejercicio se apilan |
| `<620px` | Cabecera y márgenes compactos; se oculta el nombre junto al avatar |

Las rejillas usan `repeat(auto-fit, minmax(min(Npx, 100%), 1fr))`: las columnas las decide el
ancho disponible, no un punto de quiebre escrito a mano por pantalla. El `min(…, 100%)` es lo
que impide el desborde — `rejillas.spec.ts` vigila que ninguna pista use `fr` desnudo.

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
