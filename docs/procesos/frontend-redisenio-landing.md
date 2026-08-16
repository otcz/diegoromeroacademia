# Proceso: rediseño de la landing pública

**Módulo:** frontend · **Fase:** 1 · **Estado:** vigente · **Actualizado:** 2026-08-15

> Especificación producida por un panel de diseño: tres propuestas independientes con ejes
> narrativos distintos (la ruta de aprendizaje, la prueba social, el producto funcionando),
> tres jueces con lentes separadas (fidelidad al sistema, conversión, viabilidad técnica) y
> una síntesis final. Se conserva completa porque el *porqué* de cada descarte vale tanto
> como la decisión que se tomó.

## Idea central

La landing deja de ser una lista de argumentos y pasa a ser un camino: la ruta de cuatro niveles —el patron numero uno que la especificacion §14.2 toma de Platzi— aparece sobre el pliegue, se convierte en la pieza central de la pagina y reaparece en miniatura en el catalogo. Cada afirmacion viaja pegada a su evidencia comprobable (cifra con procedencia, comentario publico del canal, precio a la vista), y toda la transparencia que pidio el propietario —velos sobre foto y cristal esmerilado— entra como TOKENS del sistema aprobados por ADR, no como estilos sueltos. Base: propuesta «ruta» (mejor en conversion y viabilidad), con los injertos de proceso y catalogo de «producto» y los de credibilidad de «prueba». Todo funciona hoy sin una sola foto de Diego, y absorbe las fotos despues cambiando valores nulos en un manifiesto.

## Secciones

### 0. Nav publica (sin cambios)

**Fondo:** `blanco`

**Componentes:** `adr-nav-publica`

Se reutiliza <adr-nav-publica> tal cual esta (64 lineas, un signal `abierto`). NO se le agrega estado de scroll ni transparencia condicionada: bajo Angular 21 zoneless un listener de scroll escribiendo un signal dispara deteccion de cambios global en cada frame, justo en los celulares modestos que son la mayoria del trafico, y la nav la consumen todas las pantallas. Si el propietario insiste mas adelante, se hace con centinela + IntersectionObserver, nunca con listener de scroll.

**Copy:**

```
Diego Romero / ACADEMIA · Cursos · Simulador · Planes · [Entrar] [Registrarme]
```

### 1. Heroe — promesa y ruta

**Fondo:** `imagen-con-velo (noche azul)`

**Componentes:** `adr-marco-imagen` · `adr-panel-cristal` · `adr-ruta-niveles` · `adr-item-nivel` · `adr-boton` · `adr-icono`

Full-bleed. padding-block 104px/96px EXACTO del handoff (no vh: un min-height en vh pisa un valor declarado final y se rompe si el H1 crece). Capa 0: <adr-marco-imagen variante="fondo" relacion="16/9" [fuente]="activos.heroe"> a sangre; sin archivo pinta --adr-degradado-marcador-oscuro. Capa 1: --adr-velo-lateral. Capa 2: rejilla `1fr 400px`, gap --adr-espacio-7, alineada al centro, dentro de .adr-contenedor.
IZQUIERDA (max 44ch): kicker mango caps 12px; H1 64px Bricolage 800 con <span class="adr-subrayado"> en «desde cero» — UNICO subrayado mango de la pagina; una linea 18px --adr-oscuro-texto-fuerte; fila de acciones (<adr-boton variante="primario" enlace="/registro"> de 48px + enlace claro con flecha); nota 12px --adr-oscuro-texto-suave. Todo el texto se ancla en el tercio izquierdo, donde el velo supera el 70% de opacidad: asi cualquier foto futura cumple AA sin tocar la formula del velo.
DERECHA: <adr-panel-cristal variante="oscuro"> de 400px con <adr-ruta-niveles [compacta]="true" [soloLectura]="true">: cuatro <adr-item-nivel> cosidos por un riel vertical de 2px --adr-oscuro-borde. Nivel 1 estado `actual` (punto azul rey macizo + etiqueta «Disponible»); niveles 2-4 estado `bloqueado` (<adr-icono nombre="lock"> + texto). Pie del panel: una linea de dato, SIN barra de progreso al 0% (una barra vacia informa al visitante de que no ha hecho nada; el efecto de progreso dotado necesita una ventaja de salida, no un cero).
MOVIL: una columna, H1 a 40px (--adr-texto-seccion), el panel baja bajo la nota, blur a --adr-cristal-desenfoque-movil.

**Copy:**

```
ACORDEÓN VALLENATO · NIVEL 1 ABIERTO
Aprende acordeón [desde cero].
Cuatro niveles. Un solo camino.
[Empezar ahora]  Planes desde $34.900 →
Precios visibles, sin registrarte · Cancela cuando quieras

— panel de cristal —
TU RUTA
Nivel 1 · Disponible
Nivel 2 · Bloqueado
Nivel 3 · Bloqueado
Nivel 4 · Bloqueado
96 clases en 4 niveles
```

### 2. Cinta de cifras

**Fondo:** `blanco`

**Componentes:** `adr-dato`

Tarjeta BLANCA OPACA (nunca cristal: un panel translucido no puede llevar el mismo color de texto sobre oscuro y sobre claro a la vez) de ancho --adr-contenedor-max, `position: relative; margin-top: calc(-1 * var(--adr-espacio-7))` = -48px, valor que si esta en la escala. Radio --adr-radio-tarjeta, borde 1px --adr-color-borde-divisor, sombra --adr-sombra-tarjeta-alta. Rejilla de 4 <adr-dato> con divisores verticales 1px --adr-color-borde-divisor. Cifra Bricolage 700 a var(--adr-texto-cifra) = 32px con `font-variant-numeric: tabular-nums`; rotulo caption 12px caps con --adr-espaciado-letra-caption. Altura 96px. Bajo la tarjeta, una linea de 12px atenuada con la procedencia: es lo que separa un dato de una consigna publicitaria. Se ELIMINA «362 videos publicados»: es una senal de alternativa gratuita puesta justo antes del muro de pago. MOVIL: rejilla 2x2, solape reducido a -24px.

**Copy:**

```
26.000  SUSCRIPTORES
4       NIVELES
96      CLASES
100%    EXÁMENES QUE REVISA DIEGO

Cifras públicas del canal @DiegoRomeroAcordeon.
```

### 3. La ruta — pieza central

**Fondo:** `niebla`

**Componentes:** `adr-ruta-niveles` · `adr-item-nivel` · `adr-icono` · `adr-etiqueta`

Seccion con --adr-separacion-seccion arriba y abajo. Encabezado a la izquierda: kicker azul + H2 40px. Debajo, <adr-ruta-niveles orientacion="auto" [soloLectura]="true">.
ESCRITORIO: riel horizontal de 4px radio 999 en --adr-color-pista-barra, SIN tramo relleno en verde (el verde solo comunica progreso o aprobacion, y en una landing el visitante tiene progreso cero). Cinco <adr-item-nivel> sobre `grid-template-columns: repeat(5, 1fr)`. Circulo de 56px: el 1 macizo azul rey con numeral blanco; los 2-4 blancos con borde 2px --adr-color-borde-suave e icono `lock`; la meta blanca con borde 2px --adr-color-azul-rey e icono `seal-check` (NO mango: el mango solo va en subrayados, estrellas y etiquetas «Nuevo»/«Recomendado»). Bajo cada circulo, tarjeta blanca radio 16, borde divisor, padding --adr-espacio-5: eyebrow caption, titulo Bricolage 700 20px y —solo si `resumen` no es null— una linea 15px. Estado bloqueado: opacity .72 + icono + texto «Se abre al aprobar el examen anterior». El estado se comunica SIEMPRE con forma, nunca solo con color.
MOVIL: el riel gira a vertical, 2px, a 28px del borde izquierdo; circulos de 40px; tarjetas a la derecha del riel. PROHIBIDO carrusel: escondería tres de las cinco estaciones en el dispositivo mayoritario.
El componente vive en compartido/ porque es tambien la pantalla 8 (/curso/{slug}); la landing lo usa en modo soloLectura.

**Copy:**

```
LA RUTA
Cuatro niveles, un camino.

NIVEL 1
NIVEL 2
NIVEL 3
NIVEL 4
META · Certificado verificable

Cada nivel se abre al aprobar el examen del anterior.
```

### 4. Dentro de un nivel

**Fondo:** `blanco`

**Componentes:** `adr-icono`

Interludio deliberadamente SIN chrome de tarjeta: tres columnas iguales separadas por divisores verticales de 1px --adr-color-borde-divisor. La ausencia de caja es lo que la hace leer como paso y no como una cuarta tanda de tarjetas. Encabezado centrado (unica seccion centrada de la pagina). Cada columna: <adr-icono> de 32px en --adr-color-azul-rey dentro de un circulo de 56px con fondo --adr-tinte-azul-fondo; titulo Bricolage 700 20px; UNA linea 15px --adr-color-texto-secundario. Iconos existentes en el registro: `play-circle`, `download-simple`, `seal-check`. MOVIL: una columna, divisores horizontales, icono 32px a la izquierda del texto en fila, para no gastar tres pantallazos de alto.

**Copy:**

```
DENTRO DE UN NIVEL
Ves, practicas, apruebas.

Ves la clase
Video, partitura y pista.

Practicas
Con la pista de la clase.

Apruebas
Diego revisa tu video, uno por uno.
```

### 5. El simulador

**Fondo:** `noche-azul`

**Componentes:** `adr-marco-imagen` · `adr-etiqueta` · `adr-icono`

Seccion oscura a sangre, la unica del cuerpo de la pagina. Rejilla `1fr 1fr`, gap --adr-espacio-7, centrada.
IZQUIERDA: <adr-marco-imagen variante="ventana" relacion="16/10" [fuente]="activos.simulador"> — barra de cromo superior de 32px con tres puntos atenuados y una pastilla de ruta. Es el UNICO sitio de la pagina donde aparece este idioma: repetido en cuatro secciones deja de ser un recurso y se vuelve el lenguaje visual de la pagina. Sin captura, el marco pinta con CSS y tokens el diagrama de botones del acordeon: tres hileras de circulos de 20px en --adr-oscuro-borde, tres encendidos en --adr-color-azul-rey. Es geometria de la propia marca, no ilustracion de banco. `aria-hidden="true"` y sin un solo elemento enfocable: una maqueta decorativa con elementos tabulables es una trampa de accesibilidad.
DERECHA: kicker mango caps, H2 40px blanco, UNA linea 18px, y una fila de tres <adr-etiqueta tinte="sobre-oscuro"> con icono. Sustituye a los tres checks VERDES de la landing actual: BPM, loop y afinaciones no son progreso ni aprobacion, y el verde decorativo rompe la regla de color 3.
MOVIL: una columna, la ventana primero, recortada a su zona util en vez de encogida hasta lo ilegible.

**Copy:**

```
SOLO AQUÍ
El simulador de pisadas.
Marca el botón y la dirección del fuelle, al ritmo del video.
[BPM ajustable] [Loop A–B] [Afinaciones FBE y GCF]
```

### 6. Catálogo

**Fondo:** `blanco`

**Componentes:** `adr-tarjeta-curso` · `adr-marco-imagen` · `adr-ruta-niveles` · `adr-etiqueta` · `adr-dificultad` · `adr-boton`

Banda blanca entre dos secciones de otro tono. Encabezado en fila con enlace de texto a la derecha, alineado a la linea base del H2. Rejilla ASIMETRICA `2fr 1fr 1fr`, gap --adr-espacio-5: tres tarjetas iguales comunicarian que suscripcion y tutoriales sueltos valen lo mismo, y no es cierto.
TARJETA ANCHA (curso completo): <adr-tarjeta-curso destacada>, borde 2px --adr-color-azul-rey, sombra --adr-sombra-destacado, radio 14; portada 200px con <adr-marco-imagen velo="inferior">; dentro del cuerpo, una <adr-ruta-niveles [compacta]="true"> de cinco puntos de 12px sobre riel de 2px que ata la tarjeta al eje narrativo; titulo 20px; fila de metadatos con chips; <adr-boton variante="primario" [anchoCompleto]="true">.
TARJETAS ESTRECHAS: <adr-tarjeta-curso> con portada 170px, <adr-etiqueta tinte="mango">Nuevo</adr-etiqueta> flotando arriba-izquierda cuando aplica, titulo 20px, fila meta con <adr-dificultad> y numero de alumnos en caption, y pie con precio Bricolage 700 22px tabular-nums + <adr-boton variante="secundario">. Se ELIMINAN las descripciones de dos lineas: dificultad, alumnos y precio ya dicen lo que hay que saber.
MOVIL: una columna, la ancha primero.

**Copy:**

```
CATÁLOGO
La ruta completa o una canción.
Ver todo →

Curso completo de acordeón
4 niveles · 96 clases
[Empezar con el plan]

La gota fría   (Nuevo)
★★★☆☆ · (sin cifra de inscritos — ver nota al pie de esta sección)
$34.900   [Comprar]

Los caminos de la vida
★★☆☆☆ · (sin cifra de inscritos — ver nota al pie de esta sección)
$34.900   [Comprar]

Lo que compras es tuyo para siempre.
```

### 7. Planes y garantías

**Fondo:** `niebla`

**Componentes:** `adr-tarjeta-plan` · `adr-etiqueta` · `adr-icono` · `adr-boton`

Kicker azul + H2 40px. Tres <adr-tarjeta-plan> en `repeat(3, 1fr)`, gap --adr-espacio-5, con `display: flex` y el boton pegado abajo con `margin-top: auto` para que los tres queden a la misma altura pase lo que pase con el texto. Nombre 20px, precio Bricolage 700 36px tabular-nums con periodicidad 15px/400 atenuada en la misma linea, UNA linea de descripcion, boton a ancho completo. DESTACADA (Anual): borde 2px --adr-color-azul-rey, sombra --adr-sombra-destacado, <adr-etiqueta tinte="mango">Recomendado</adr-etiqueta> a `top: -13px; left: 24px`, y boton primario; las otras dos con boton secundario. NO se agranda ni se eleva: el borde y la sombra ya la separan, y escalarla rompe la linea base de los tres precios.
Bajo la rejilla, en lugar de un acordeon de preguntas, una tira de cuatro <adr-etiqueta tinte="neutro"> con icono 20px a ancho completo: mata las cuatro objeciones de compra en tres palabras cada una. Iconos ya registrados: `credit-card`, `x-circle`, `lock`, `clock`. Cierra una linea de 12px atenuada. Una sola accion azul compitiendo por tarjeta y ningun otro CTA en la seccion.
MOVIL: una columna, la destacada primero; los chips 2x2.

**Copy:**

```
PLANES · PRECIOS VISIBLES
Elige cómo avanzar.

Mensual
$39.900/mes
Toda la ruta mientras el plan esté activo.
[Elegir mensual]

Anual   (Recomendado)
$349.900/año
Dos meses gratis.
[Elegir anual]

Curso suelto
desde $34.900
Pago único, acceso permanente.
[Ver catálogo]

[PSE, Nequi y tarjeta] [Cancela cuando quieras] [Pasarela certificada] [Acceso inmediato]

Precios provisionales en COP.
```

### 8. Prueba pública (con guarda)

**Fondo:** `blanco`

**Componentes:** `adr-cita-verificada` · `adr-avatar` · `adr-etiqueta` · `adr-icono`

SECCION CONDICIONADA: `@if (comentarios.length > 0)`. Si no hay comentarios reales capturados del canal, la seccion NO se renderiza. Mejor ausente que fabricada — publicar una cita de alumno inventada sobre la marca personal de una persona real es un problema legal y reputacional, y ademas es prueba social que el visitante descuenta.
Encabezado a la izquierda. Rejilla de tres <adr-cita-verificada> (3 columnas escritorio, 1 en movil sin carrusel). Cada tarjeta: cita REAL de maximo 20 palabras, sin editar, en Bricolage 700 20px; pie con <adr-avatar> de iniciales 40px + arroba del autor en caption + <adr-etiqueta tinte="neutro"> con <adr-icono nombre="play-circle" [tamanio]="16"> y enlace al video. Linea de procedencia de 12px atenuada bajo la rejilla.
El mismo componente muta a <adr-etiqueta tinte="verde"> «NIVEL 1 APROBADO» cuando existan alumnos con nivel aprobado, sin tocar la plantilla: ahi el verde SI significa aprobacion.

**Copy:**

```
EN EL CANAL
Lo que dicen sus alumnos.

«[comentario real del canal, sin editar, máx. 20 palabras]»
@usuario · [COMENTARIO EN YOUTUBE]  Ver en el canal →

Comentarios públicos del canal, sin editar.
```

### 9. Cierre y pie

**Fondo:** `noche-azul`

**Componentes:** `adr-boton` · `adr-icono` · `adr-pie-publico` · `adr-whatsapp-flotante`

Bloque oscuro a sangre que continua sin costura en <adr-pie-publico>. Fusiona cierre y remate en UNA sola seccion: gastar dos secciones aqui es un pantallazo extra de scroll justo antes del CTA final. Un cabo de riel de 2px --adr-oscuro-borde entra por el borde superior y muere en un punto azul rey de 12px sobre el H2: es el mismo hilo que arranco en el panel del heroe. H2 42px Bricolage 800 blanco SIN subrayado mango — el gesto ya se gasto en el H1 y docs/04 §1 lo limita a una vez por pantalla. Fila de dos acciones de 48px: <adr-boton variante="primario"> y <adr-boton variante="sobre-oscuro"> con icono `whatsapp-logo`. Nota 12px atenuada. Debajo, sobre un borde 1px --adr-oscuro-borde, el <adr-pie-publico> existente sin cambios (Terminos, Reembolsos, Verificar certificado, redes, copyright). <adr-whatsapp-flotante> fijo abajo-derecha, por encima de todo. MOVIL: una columna, botones apilados a ancho completo con gap 12px.

**Copy:**

```
Empieza hoy por el nivel 1.
[Registrarme]  [Hablar por WhatsApp]
Sin permanencia · Cancela cuando quieras
```

## Componentes nuevos

### `adr-marco-imagen`

El mecanismo que hace que la pagina funcione hoy sin fotos y las absorba despues sin tocar plantillas. Sostiene relacion de aspecto, radio, velo, width/height declarados y loading/fetchpriority; si `fuente` es null pinta un marcador del sistema con --adr-degradado-marcador-*. Ninguna imagen puede provocar salto de diseno ni dejar un hueco gris. La variante `ventana` agrega la barra de cromo de 32px (idioma reservado a la seccion del simulador). Vive en compartido/componentes/marco-imagen/.

**Entradas:** fuente: string | null · relacion: '16/9' | '16/10' | '4/5' | '3/2' · velo: 'lateral' | 'inferior' | 'ninguno' · variante: 'plano' | 'fondo' | 'ventana' · texto: string (alt) · prioritaria: boolean

### `adr-item-nivel`

Una parada de la ruta. YA ESTA DECLARADO con este selector en docs/04 §3 y no existe en compartido/componentes/: se construye aqui y lo heredan las pantallas 7, 8 y 9. NO se rebautiza: renombrarlo en el commit fundacional es exactamente el modo de falla que existe para impedir la regla 11. Contrato duro: el estado se pinta SIEMPRE con icono y texto ademas de color (completado = check-circle verde, actual = punto azul macizo + etiqueta «Actual», bloqueado = lock + borde suave + opacidad + texto explicativo, meta = seal-check con borde azul).

**Entradas:** estado: 'completado' | 'actual' | 'bloqueado' | 'meta' · numero: number · titulo: string · resumen: string | null · chip: string | null · compacto: boolean

### `adr-ruta-niveles`

LA pieza. Compone <adr-item-nivel> sobre un riel y es a la vez la pantalla 8 (/curso/{slug}) con estado real; la landing la usa en modo soloLectura. Un solo componente evita que la version de marketing y la del producto se separen en tres sprints. En movil el riel gira a vertical y se ven las cinco estaciones: prohibido convertirlo en carrusel.

**Entradas:** estaciones: readonly EstacionRuta[] · orientacion: 'auto' | 'horizontal' | 'vertical' · compacta: boolean · soloLectura: boolean

### `adr-panel-cristal`

Encapsula en un solo sitio el backdrop-filter, el borde, el radio, el respaldo @supports y el apagado bajo prefers-reduced-transparency. Sin este componente el cristal se copia mal en cinco lugares y el texto queda ilegible en los navegadores del publico objetivo. Regla de uso: el velo va SIEMPRE por debajo del cristal, y el cristal solo sobre noche azul o sobre imagen — nunca sobre niebla, donde no hay nada que difuminar y solo baja el contraste.

**Entradas:** variante: 'oscuro' | 'claro'

### `adr-dato`

Atomo de cifra + rotulo. Bricolage 700 a --adr-texto-cifra con font-variant-numeric: tabular-nums, rotulo caption caps con --adr-espaciado-letra-caption, y ranura opcional de procedencia. Se usa en la cinta de cifras y en la meta de las tarjetas.

**Entradas:** valor: string · rotulo: string · icono: string | null

### `adr-tarjeta-curso`

Declarado en docs/04 §3 y no implementado: hoy la landing lo maqueta a mano dentro de landing.html, que es precisamente lo que prohibe la regla 11. Portada 170px (200px la destacada), radio 14, ranura de progreso, pie con precio y accion.

**Entradas:** titulo: string · kicker: string · portada: string | null · precio: string | null · dificultad: number | null · alumnos: number | null · etiquetaNueva: boolean · destacada: boolean · textoAccion: string · enlace: string

### `adr-tarjeta-plan`

Declarado en docs/04 §3 y no implementado; hoy vive suelto en la landing. Incluye la variante destacada exacta del handoff: borde azul 2px + --adr-sombra-destacado + etiqueta mango flotante a -13px, y el boton anclado abajo con margin-top: auto.

**Entradas:** nombre: string · precio: string · periodicidad: string · descripcion: string · textoAccion: string · recomendado: boolean · enlace: string

### `adr-avatar`

Declarado en docs/04 §3 y no implementado. Iniciales o foto, 40/48px. Lo necesitan las citas y cualquier pantalla de perfil. Degrada a iniciales, asi que no depende de ningun activo.

**Entradas:** nombre: string · foto: string | null · tamanio: 40 | 48

### `adr-cita-verificada`

Testimonio corto con avatar, atribucion, sello de procedencia y enlace a la fuente publica. Sirve hoy para comentarios reales de YouTube y manana para alumnos con nivel aprobado —cambiando solo el tinte del sello a verde— sin tocar la plantilla. El sello NO es un componente nuevo: es <adr-etiqueta> con un <adr-icono> proyectado.

**Entradas:** cita: string · autor: string · enlaceFuente: string · textoSello: string · selloAprobado: boolean

### `adr-etiqueta (MODIFICACION)`

No es un componente nuevo: se agrega el tinte 'sobre-oscuro' al tipo TinteEtiqueta, que hoy es exactamente 'azul' | 'mango' | 'verde' | 'neutro' en etiqueta.ts. Lo necesitan los chips del simulador sobre noche azul. Es una extension del catalogo aprobado y entra en el mismo ADR que los tokens, no por la puerta de atras.

**Entradas:** tinte: 'azul' | 'mango' | 'verde' | 'neutro' | 'sobre-oscuro'

### `adr-landing-heroe · -cifras · -ruta · -nivel · -simulador · -catalogo · -planes · -prueba · -cierre`

Nueve componentes de SECCION, locales en funcionalidades/landing/secciones/, no de catalogo. No son opcionales: landing.html tiene hoy 201 lineas contra el tope de 150 de docs/01 §8, y landing.scss pesa 5.946 B contra un aviso de 6.144 B en angular.json — o sea que hoy, sin agregar nada, esta al 96,8% del presupuesto. Trocear deja landing.html en ~14 lineas de etiquetas y reparte el .scss en nueve presupuestos independientes en vez de uno saturado.

**Entradas:** Cada uno recibe su porcion de landing.contenido.ts por input readonly; ninguno hace HTTP ni tiene logica de plantilla.

## Tokens nuevos

- --adr-velo-lateral: linear-gradient(100deg, rgb(14 27 46 / 88%) 30%, rgb(14 27 46 / 45%) 65%, rgb(14 27 46 / 10%) 100%) — la formula de tres paradas del handoff, RECOLOREADA sobre Noche azul #0E1B2E. El literal actual de landing.scss:20 usa rgb(10 19 33), un oscuro que no esta en la tabla de colores del handoff ni en _tokens.scss: viene arrastrado del prototipo. Promover un literal no lo aprueba; el ADR lo corrige a la paleta real y la diferencia de 4 puntos es invisible.
- --adr-velo-inferior: linear-gradient(180deg, rgb(14 27 46 / 0%) 45%, rgb(14 27 46 / 55%) 100%) — para portadas de curso, garantiza que la etiqueta mango «Nuevo» contraste sobre cualquier foto.
- --adr-cristal-fondo-oscuro: rgb(255 255 255 / 6%)
- --adr-cristal-fondo-claro: rgb(255 255 255 / 72%)
- --adr-cristal-desenfoque: 16px
- --adr-cristal-desenfoque-movil: 8px
- --adr-cristal-respaldo-oscuro: color-mix(in srgb, var(--adr-color-blanco) 10%, var(--adr-color-noche-azul)) — respaldo macizo bajo @supports not (backdrop-filter: blur(1px)) y bajo prefers-reduced-transparency.
- --adr-cristal-respaldo-claro: var(--adr-color-blanco)
- --adr-degradado-marcador-oscuro: linear-gradient(135deg, color-mix(in srgb, var(--adr-color-azul-profundo) 24%, var(--adr-color-noche-azul)), var(--adr-color-noche-azul) 70%) — sustituye el literal #1b3557 de landing.scss:21, que tampoco esta en la paleta aprobada. Ahora se deriva de dos colores que si lo estan.
- --adr-degradado-marcador-claro: linear-gradient(135deg, var(--adr-tinte-azul-fondo), var(--adr-color-pista-barra) 70%) — sustituye los literales #dbe6f5 y #c6d5ea de landing.scss:162.
- NO se agrega token de solape: el unico de la pagina usa calc(-1 * var(--adr-espacio-7)) = -48px, que si esta en la escala 4/8/12/16/24/32/48/64/88. Los -40px y -44px que proponia el panel quedan fuera de escala y se descartan.

## Uso de imágenes

SEIS huecos en toda la pagina y ni uno mas: (1) fondo del heroe, 16:9 escritorio y 4:5 movil; (2) captura del simulador, 16:10, dentro del marco variante «ventana»; (3-5) tres portadas de curso, 170px de alto (200px la destacada); (6) avatares de las citas, 40px — este ultimo se resuelve con iniciales y no necesita foto nunca.

COMO FUNCIONA HOY, SIN UNA SOLA FOTO. Todo hueco pasa por <adr-marco-imagen [fuente]="null">, que pinta un marcador del sistema en vez de un hueco gris: el heroe con --adr-degradado-marcador-oscuro; las portadas con --adr-degradado-marcador-claro y el icono duotone del curso al 8% de opacidad; el simulador con el diagrama de botones del acordeon dibujado en CSS y tokens (tres hileras de circulos de 20px, tres encendidos en azul rey). Es geometria de la propia marca: se sostiene sola, se ve deliberada y no miente. Se descarta la rotacion de matiz por indice de curso que proponia «producto»: fabrica colores fuera de la paleta por construccion, que es el unico mecanismo del panel que automatiza la deriva cromatica. En su lugar, tres degradados fijos derivados de la paleta aprobada, elegidos por indice.

LA DEGRADACION ES POR ENTRADA, NO POR 404. Se descarta el contrato de background-image + image-set() apuntando a archivos inexistentes: dispara una peticion fallida por hueco en cada carga, con error en consola y penalizacion en auditoria, y es intestable. Aqui el componente recibe `fuente: string | null` y decide en un computed(): tres lineas de Vitest lo cubren.

COMO ABSORBE FOTOS DESPUES, SIN TOCAR CODIGO. Las rutas viven en un unico manifiesto, frontend/src/app/disenio/activos.ts —no dentro de landing.contenido.ts—, porque <adr-marco-imagen> vive en compartido/ y lo van a consumir las pantallas 7 y 8: si el mapa vive en un archivo de la landing, la primera pantalla interna que necesite una portada lo duplica. Claves: heroe, simulador, curso-completo, la-gota-fria, los-caminos-de-la-vida, todas en null hoy. Diego entrega las fotos, se dejan en frontend/public/imagenes/ con el nombre acordado y se cambian cinco nulos por cinco rutas: ni una plantilla, ni un .scss, ni un componente se tocan. El velo, la relacion de aspecto, el width/height y el loading ya estan resueltos, asi que una foto mala tampoco rompe el diseno: el texto del heroe se ancla donde el velo supera el 70% de opacidad.

LOS ACTIVOS ACTUALES DE D:/diegoromeroacademia/imagenes NO ENTRAN, ninguno. El collage con sombrero, guacamayas y «MADE IN COLOMBIA» esta sobresaturado, pelea con la paleta «Azul rey» y es exactamente la estetica de banco que docs/04 §7 prohibe. Las dos ilustraciones de acordeonistas anonimos son ilustracion generica en una marca personal —lo que el handoff veta— y ademas tienen origen aparente de Behance sin licencia verificada. El acordeon rojo recortado aparenta venir de Wikipedia, arrastra atribucion CC que nadie ha revisado y su fondo claro se rompe sobre el heroe oscuro. Es riesgo legal ademas de riesgo de marca: un degradado del sistema comunica «foto pendiente»; una foto de banco comunica «esta academia no es de nadie», que es lo contrario de lo que vende esta pagina.

QUE PEDIRLE A DIEGO. Una sola sesion resuelve la pagina entera: dos de el tocando (una vertical 4:5 para movil, una apaisada), una de manos sobre los botones y tres capturas del simulador funcionando. Es la tarea de mayor retorno pendiente del proyecto. Mientras tanto la pagina no se ve incompleta: se ve grafica.

## Plan de implementación

1. ADR 0008 «Velos, cristal y marcadores del sistema visual», ANTES de escribir una sola linea de scss nuevo. _tokens.scss linea 9 dice literalmente que proponer un valor nuevo requiere un ADR, y docs/04 §1 lo repite. El ADR declara los diez tokens de la lista, justifica que --adr-velo-lateral recolorea la formula del handoff sobre Noche azul #0E1B2E porque el rgb(10 19 33) del prototipo no esta en ninguna tabla aprobada, y aprueba el quinto tinte 'sobre-oscuro' de <adr-etiqueta>. Sin este ADR solo quedan dos salidas malas: escribir literales (rompe la regla 15) o renunciar a la transparencia que pidio el propietario.
1. Mismo commit: corregir en docs/handoff-disenio/README.md las DOS contradicciones entre fuentes aprobadas, para que dejen de contradecirse en la proxima sesion. (a) §Screens 1.9 pone subrayado mango en el H2 del pie ademas del H1, mientras docs/04 §1 lo limita a uno por pantalla: se conserva en el H1 y se quita del pie. (b) §Screens 1.5 pone tres checks VERDES en las features del simulador, que no son progreso ni aprobacion y contradicen la regla de color 3: pasan a chips neutros sobre oscuro.
1. Tokenizar los literales vigentes de landing.scss —lineas 20-21 (rgb(10 19 33 / 88%), #1b3557, #0e1b2e) y linea 162 (#dbe6f5, #c6d5ea)— con los tokens del ADR. Es precondicion, no nota al pie: hoy son un defecto de revision y no se puede agregar ni un degradado mas encima de ellos.
1. Trocear la landing en nueve componentes de seccion bajo funcionalidades/landing/secciones/ y dejar landing.html en ~14 lineas. Precondicion tambien: 201 lineas contra el tope de 150 y 5.946 B contra un aviso de 6.144 B significan que cualquier linea que se sume hoy dispara la alerta. Se hace ANTES de agregar contenido nuevo, no despues.
1. Crear frontend/src/app/disenio/activos.ts con las cinco claves de foto en null, y mover a landing.contenido.ts las cifras, los nombres de nivel (sin inventar: solo «Nivel 1»..«Nivel 4», con `resumen: string | null` en null hasta que Diego confirme) y los comentarios del canal (array vacio). Cada constante lleva la advertencia y la CONDICION DE SALIDA declarada: desaparece cuando exista el endpoint que la sirva. Un nombre de nivel o un precio escrito en el codigo es lo que prohibe la regla 4, y aqui solo se tolera porque todavia no hay de donde leerlo.
1. Fase 1 de componentes (desbloquea todo lo demas): <adr-marco-imagen>, <adr-panel-cristal>, <adr-dato>. Pruebas de verdad: que el marco pinta el marcador cuando `fuente` es null, que el panel cae al respaldo macizo sin backdrop-filter, y que <adr-dato> aplica tabular-nums.
1. Fase 2: <adr-item-nivel> con sus cuatro estados y <adr-ruta-niveles>. Prueba obligatoria de que los cuatro estados se pintan con ICONO ademas de color, y de que no se pierden estaciones al cambiar de orientacion. Es el bloque mas caro y el unico que se amortiza en el producto: es literalmente la pantalla 8.
1. Fase 3, catalogo pendiente: <adr-tarjeta-curso>, <adr-tarjeta-plan>, <adr-avatar>, <adr-cita-verificada>. Antes de mover el marcado de curso y plan desde landing.html a compartido/, comprobar que ninguna otra pantalla depende del marcado actual.
1. Generar los iconos que falten con `npm run iconos:generar`. Auditado contra registro-iconos.ts: NO hace falta ninguno. Los catorce que usa esta especificacion —lock, lock-open, check-circle, play-circle, seal-check, certificate, star, clock, credit-card, x-circle, download-simple, arrow-right, whatsapp-logo, list— ya estan registrados. Se descartaron a proposito music-notes, flag-banner y metronome, que no estan: la estacion meta usa seal-check.
1. Montar las secciones bajo el pliegue con @defer (on viewport) y content-visibility: auto; solo el heroe y la cinta de cifras entran en el bundle critico. Presupuesto de rendimiento MEDIBLE, no una buena intencion: maximo dos superficies con backdrop-filter en toda la pagina (panel del heroe y ninguna otra por defecto), blur a --adr-cristal-desenfoque-movil bajo 768px, respaldo macizo bajo @supports, apagado bajo prefers-reduced-transparency, y si el LCP movil sube mas de 200 ms respecto de la landing actual, el cristal del heroe cae a superficie maciza. El gusto estetico del propietario no puede costar conversion en el dispositivo mayoritario.
1. Capturar los comentarios reales del canal para la seccion 8. Si al publicar no estan, la seccion no se renderiza y la pagina sale sin ella: mejor ausente que fabricada.
1. Confirmar con Diego, antes de publicar, las tres decisiones de negocio que esta pagina no puede tomar: los nombres y el contenido de los cuatro niveles, la disponibilidad real del simulador (es Fase 3 segun §6.1 y la pagina lo vende en presente), y si habra una clase de muestra al registrarse. Cada una tiene su hueco ya preparado en contenido.ts y ninguna bloquea la implementacion.
1. Cerrar el checklist: `npm test` con cobertura sobre los nueve componentes nuevos, `npm run lint`, verificar los dos presupuestos (150 lineas de plantilla, 6 kB por .scss) en las nueve secciones, y actualizar docs/04 §3 marcando como implementados los componentes que dejan de ser promesa.

## Lo que se descartó, y por qué

Esta lista vale tanto como la especificación: evita que una sesión futura reintroduzca
algo que ya se evaluó y se rechazó por un motivo concreto.

- NO se publica un testimonio inventado. La cita que hoy vive en landing.html («Llevaba años viendo videos sueltos… en tres meses aprobé el nivel 1») no corresponde a ningun alumno real. Sobre la marca personal de una persona real eso es un problema legal y reputacional, y ademas es prueba social que el visitante descuenta: una cita anonima sin enlace no convence a nadie que haya visto cien landings. La seccion 8 va detras de una guarda `@if` y sale con comentarios publicos del canal, citados literalmente y enlazados, o no sale.
- NO entra el verificador de certificados. Es la pantalla 13, Fase 2 segun §6.1, no esta en el inventario de secciones del handoff, y publicar un campo de formulario deshabilitado en una pagina de venta es friccion pura que ademas anuncia que la funcion no existe. Peor: apunta a quien YA tiene certificado, no al visitante que hay que registrar. El enlace «Verificar certificado» se queda donde ya estaba: en el pie.
- NO se usan pestanias ni un tour de producto. Esconder la ruta de niveles tras un toque, en el dispositivo por el que llega la mayoria del trafico de YouTube, anula justo el patron que la especificacion §14.2 lista PRIMERO entre lo que se toma de Platzi. Es el mismo error que un carrusel, con otro nombre.
- NO se maquetan maquetas de las pantallas 8, 9 y 12. Dibujar el reproductor y el simulador como si existieran no es riesgo de deriva de UI: es brecha entre promesa y entrega, y la 12 es Fase 3. Se cobra en reembolsos y reclamos al mes de lanzar. La unica representacion que queda es el diagrama de botones del simulador, y es esquematico y explicito, no una captura simulada.
- NO se convierte la cinta de cifras en una franja oscura de cristal. Un panel translucido montado a caballo entre el heroe oscuro y la niebla clara deja texto blanco sobre fondo casi blanco en su mitad inferior —ratio cercano a 1,1:1 contra los 4,5:1 que exige docs/04 §5— y ademas crea una cuarta zona oscura cuando la regla de color 4 enumera tres. La cinta es una tarjeta blanca opaca.
- NO se repite el marco de ventana con barra de cromo. Aparece UNA vez, en el simulador. En cuatro secciones deja de ser un recurso y se convierte en el lenguaje visual de una pagina cuyo sistema aprobado no lo contiene.
- NO se rota el matiz de los degradados de portada por indice de curso. Fabrica colores fuera de la paleta por construccion: es el unico mecanismo propuesto que automatiza la deriva cromatica, y venia listado como patron en vez de como riesgo. Se usan tres degradados fijos derivados de la paleta.
- NO se renombra <adr-item-nivel>. docs/04 §3 ya lo declara con ese selector; llamarlo <adr-estacion-ruta> es precisamente lo que la regla 11 existe para impedir, y un renombre en el commit fundacional condena a las pantallas 8 y 9 a heredarlo.
- NO se generan iconos nuevos. music-notes, flag-banner y metronome no estan en registro-iconos.ts; la estacion meta se resuelve con seal-check, que si esta. `npm run iconos:generar` deja de ser un paso previo obligatorio.
- NO hay un solo emoji en el copy ni en landing.contenido.ts. Los candados, checks y puntos de estado son <adr-icono> Phosphor duotone. docs/04 §2 y la regla 12 los prohiben sin matices, y contenido.ts es justo donde un emoji sobrevive a la revision.
- NO se toca la formula del velo aprobado sumandole un tinte plano. El README manda recrear el heroe pixel a pixel. El contraste AA se consigue anclando el texto donde el velo ya supera el 70% de opacidad, que resuelve lo mismo sin modificar un valor declarado final. Lo unico que cambia es el color base, que se corrige a Noche azul porque el rgb(10 19 33) del prototipo no esta en ninguna tabla aprobada.
- NO se pinta el primer tramo del riel en verde ni se muestra una barra de progreso al 0%. El verde solo comunica progreso o aprobacion, y el visitante de una landing tiene progreso cero; una barra vacia le dice «no has hecho nada» y «te faltan 96 clases» como primer mensaje visual de la pagina.
- NO se usa mango fuera de sus tres usos enumerados. Se descartan las comillas mango del testimonio, la flecha de fuelle mango del simulador y el borde mango de la estacion meta que proponia el panel. Quedan: un subrayado en el H1, las estrellas de <adr-dificultad> y las etiquetas «Nuevo» y «Recomendado». Y un solo subrayado en toda la pagina: el del pie se elimina y se corrige el README.
- NO se conserva «362 videos publicados» en la cinta de cifras. Es una senal de alternativa gratuita colocada justo antes del muro de pago, dirigida a un publico que ya consume ese canal gratis. Se sustituye por «96 clases».
- NO se inventan nombres de nivel ni el reparto de 24 clases por nivel. El reparto salia de dividir 96 entre 4 y los nombres no estan en ningun documento. La especificidad es lo que hace persuasiva una ruta, y por eso una especificidad falsa es peor que ninguna. Las tarjetas salen con «Nivel 1».. «Nivel 4» y el campo `resumen` en null hasta que Diego lo confirme.
- NO se abre una clase gratis sin registro. Es el reductor de friccion que el panel echaba en falta, pero la especificacion §14.3 fija «registro obligatorio, contenido cerrado» como elemento tomado de FZ Academia. Una muestra gratuita es una decision de negocio de Diego, no de esta landing: queda como hueco preparado en contenido.ts (`OFERTA_MUESTRA` en null, no renderiza nada) y como punto 12 del plan.
- NO se le agrega estado de scroll a <adr-nav-publica>. Bajo Angular 21 zoneless, un listener de scroll escribiendo un signal dispara deteccion de cambios global en cada frame, en el dispositivo mas debil del publico, y la nav la consumen todas las pantallas. Si el propietario lo pide, se hace con centinela + IntersectionObserver.
- NO se degrada la ausencia de fotos con peticiones 404. Apoyarse en background-image + image-set() hacia archivos inexistentes provoca una peticion fallida por hueco en cada carga, con error de consola, penalizacion de auditoria, y es intestable con Vitest. Se degrada por una entrada `fuente: string | null` que se prueba en tres lineas.
- NO se usan valores fuera de escala. Se descartan los solapes de -40px y -44px (la escala es 4/8/12/16/24/32/48/64/88; el unico solape usa -48px), el H1 movil de 38px (se usa 40px, que es --adr-texto-seccion), la cifra a 30px que hoy esta escrita a mano en landing.scss:71 (se usa --adr-texto-cifra = 32px) y el min-height de 92vh que pisaba el padding 104/96px declarado final.
- NO se usan movimiento automatico, carruseles ni contadores animados. Nada auto-rota ni auto-avanza, con lo que prefers-reduced-motion queda satisfecho por construccion y no hace falta parchearlo en el sprint siguiente. Queda escrito como restriccion de los componentes, no como buena intencion.
- NO hay mas de dos solapes en toda la pagina. Hoy hay uno (la cinta de cifras). El limite queda escrito porque el recurso se multiplica seccion a seccion hasta volverse ruido, y es lo unico que separa una pagina disenada de una maqueta apilada.
- NO entra ninguna de las cuatro imagenes de D:/diegoromeroacademia/imagenes. Collage de banco sobresaturado, dos ilustraciones genericas de origen aparente Behance sin licencia verificada, y un recorte aparente de Wikipedia con atribucion CC no revisada. Riesgo legal ademas de riesgo de marca, y docs/04 §7 lo prohibe expresamente en una marca personal.

## Veredictos del panel

### Lente: sistema

| Propuesta | Puntos | Comentario |
|---|---|---|
| prueba | 8 | La mas literal frente a los valores aprobados, y eso es lo unico que mide esta lente. Reproduce el heroe con padding 104/96px exacto del handoff (§Screens 1.2), el nav con wordmark 22px Bricolage 800 + ACADEMIA 11px caps + enlaces 15px/500 exacto, la cifra a 32px (que es literalmente --adr-texto-cifra, la unica de las tres que acierta el token en vez del 30px literal que hoy esta escrito a mano en landing.scss:71), el caption con letter-spacing .12em (= --adr-espaciado-letra-caption) y el solape a -48px, que SI esta en la escala 4/8/12/16/24/32/48/64/88. Es la unica que convierte las reglas de color en diques ejecutables en vez de citarlas: «una sola accion azul por seccion» es la regla 1 hecha norma de revision, y el tinte verde reservado a verificado/aprobado con neutro en el resto es la lectura correcta de la regla 3 (ruta pinta el primer tramo del riel en verde en una landing sin progreso; producto conserva los tres checks verdes de features del simulador). Ritmo de fondos declarado con invariante dura («ninguna seccion clara consecutiva sin cambio de tono») y cifras en banda clara, como manda la regla 4. Subrayado mango una vez, en el H1, citando docs/04 §1. Verifique sus iconos contra registro-iconos.ts: lock, x-circle, seal-check, certificate, lock-open, play-circle, credit-card, clock, whatsapp-logo y list ya existen los diez — cero iconos nuevos, cero emojis. Lo que le cuesta el 9 y el 10: (a) le suma al velo aprobado «un tinte plano al 20%», es decir modifica una formula que el handoff declara final y que el README manda recrear pixel a pixel; (b) mango decorativo — comillas mango en la cita y flecha de fuelle mango — fuera de los tres usos enumerados en la regla 2; (c) mete en la landing aprobada una pantalla de Fase 2 (verificador de certificado) con un campo deshabilitado, que no esta en el inventario de secciones del handoff; (d) el marco de dispositivo con tres puntos y el certificado rotado -2deg son idiomas ajenos al sistema; (e) usa <adr-tarjeta-curso> y <adr-tarjeta-plan> sin advertir que docs/04 §3 los declara pero no existen en compartido/componentes/ — verificado, ahi solo hay alerta, barra-progreso, boton, campo, dificultad, etiqueta, icono, modal, nav-publica, pie-publico y whatsapp-flotante; (f) hedge sobre el ADR («si el propietario lo considera ampliacion de paleta hace falta ADR») cuando _tokens.scss linea 9 y docs/04 §1 no dejan margen. |
| ruta | 7 | Es la que mejor LEE el sistema y la que peor lo obedece en los detalles. Merito real y unico del panel: es la unica que detecta una contradiccion entre fuentes aprobadas — el README del handoff pone subrayado mango en el H1 del heroe Y en el H2 del pie (§Screens 1.9), mientras docs/04 §1 lo limita a una vez por pantalla — y en vez de elegir en silencio la declara, decide y deja la puerta abierta. Tambien es la unica que nombra el problema de fondo del contenido inventado como lo que es: un nombre de nivel o un reparto de 96/4 escrito en landing.contenido.ts es valor de negocio en el codigo, regla 4, y da la condicion de salida (desaparece cuando exista el endpoint). Su inventario de defectos es exacto: landing.html tiene 201 lineas contra el limite de 150 de docs/01 §8 y landing.scss pesa 5.946 bytes contra el aviso de 6 kB — comprobado ambos. Ritmo correcto, cifras en banda clara, cierre sin subrayado. Ahora el costo, que es alto: renombra <adr-item-nivel> — que docs/04 §3 ya declara con ese selector — a <adr-estacion-ruta>, que es precisamente el modo de falla que la regla 11 existe para impedir, y lo hace admitiendo en el mismo parrafo que es ese componente. Mete emojis en el copy propuesto (🔒 en el panel del heroe, ✓ y ● en la mini-ruta del testimonio) cuando docs/04 §2 y la regla 12 los prohiben sin matices, y el copy vive en landing.contenido.ts, que es justo donde un emoji sobrevive a la revision. Sustituye el padding aprobado 104/96px del heroe por min-height 92vh/88vh, o sea pisa un valor final del handoff. Usa -40px de solape, fuera de la escala de espaciado. Pone borde mango en el circulo «meta», un quinto uso del mango fuera de los tres enumerados. Rellena de verde el primer tramo del riel en una pagina donde el visitante tiene progreso cero. Y propone --adr-velo-lectura y dos degradados de marcador «en el mismo commit», como si tokenizar fuera un refactor y no una ampliacion de paleta que exige ADR. |
| producto | 6 | Tiene la mejor disciplina de proceso y la peor disciplina visual, y desde esta lente lo segundo pesa mas. A favor, y es sustancial: es la UNICA que exige el ADR por su nombre y con su contenido — ADR 0008 con --adr-velo-lateral, --adr-velo-inferior, --adr-cristal-fondo y --adr-cristal-desenfoque — que es exactamente lo que ordenan docs/04 §1 y la cabecera de _tokens.scss, y ademas apunta las lineas del defecto vigente (landing.scss 20-21 y 162; comprobado: rgb(10 19 33 / …), #1b3557, #0e1b2e, #dbe6f5, #c6d5ea). Es la unica que respeta la nomenclatura del catalogo al pie de la letra: <adr-pestanias>, <adr-item-nivel>, <adr-item-clase>, <adr-tarjeta-curso>, <adr-tarjeta-plan> con sus selectores declarados y marcados como no implementados, sin rebautizar nada. Y su mejor idea es puro sistema: las maquetas se componen SOLO de piezas del catalogo, de modo que no pueden derivar porque son el sistema. Cero iconos nuevos, cero emojis, subrayado una vez, cita 26px y numeral azul 40px exactos del handoff. Pero: el degradado de portada con «matiz rotado por indice de la clave del curso» fabrica colores fuera de la paleta por construccion — es el unico de los tres que automatiza la deriva cromatica, y lo presenta como patron, no como riesgo. Convierte la banda de cifras en una franja oscura de cristal cuando el handoff la define clara con borde inferior #DCE3EC, con lo que crea una cuarta zona oscura y dos zonas oscuras consecutivas arriba; la regla 4 enumera heroe, simulador y pie, no cuatro. El marco de ventana con barra de cromo y tres puntos aparece en heroe, tour, metodo y cierre: se vuelve el motivo dominante de la pagina y no existe en el sistema aprobado. H1 a 38px en movil queda fuera de las siete escalas tipograficas. -44px queda fuera de la escala de espaciado. Reutiliza --adr-sombra-destacado como halo dentro de una maqueta cuando el handoff la reserva al plan destacado. Y conserva los tres checks verdes de features del simulador sin advertir que contradicen la regla 3. |

**Mejor propuesta:** prueba — Desde la fidelidad al sistema aprobado gana la que menos inventa y la que mas veces acierta el valor exacto, no la que mejor argumenta. «prueba» reproduce sin desviarse los valores que el handoff declara finales (heroe 104/96px, nav 22/11/15-500, cita y precios en la escala, cifra a 32px que es el token real y no el 30px literal que hoy esta a mano en el repo, caption a .12em que es el token real, solape a -48px que si esta en la escala de espaciado), respeta las cuatro reglas de color mejor que ninguna — es la unica que enuncia el verde como reservado a verificado/aprobado y neutro en todo lo demas, y la unica que convierte «el azul es la unica tinta de accion» en una norma verificable de una accion azul por seccion —, mantiene la banda de cifras clara como manda la regla 4, gasta el subrayado mango una sola vez citando docs/04 §1, y no necesita un solo icono nuevo: los diez que nombra ya estan en registro-iconos.ts. Sus invenciones son pocas y de radio corto (marco de dispositivo, certificado rotado, comillas mango). «ruta» tiene la mejor lectura de las fuentes pero paga con un renombre de componente del catalogo, emojis en el copy y el pisoton al padding aprobado del heroe. «producto» tiene el mejor proceso — es la unica que exige el ADR y la unica que respeta los selectores declarados — pero su volumen de invencion visual es el mayor con diferencia: rotacion de matiz que fabrica colores fuera de paleta, banda de cifras oscura contra la regla 4 y un marco de ventana que se convierte en el lenguaje visual de toda la pagina. En una lente que penaliza la invencion, eso no se compensa con rigor documental. La ganadora es «prueba» con los injertos de proceso de «producto» y los de diagnostico de «ruta».

**Ideas rescatadas de las propuestas perdedoras:**

- DE PRODUCTO — el ADR, y es el injerto mas importante del panel. Producto es la unica que lo nombra con numero y contenido: ADR 0008 declarando --adr-velo-lateral / --adr-velo-inferior / --adr-cristal-fondo / --adr-cristal-desenfoque. _tokens.scss linea 9 dice «Proponer un valor nuevo requiere un ADR» y docs/04 §1 lo repite. Prueba hedge («si el propietario lo considera ampliacion»); ruta lo trata como refactor. Ninguna linea de velo, cristal o desenfoque se escribe antes de que ese ADR exista.
- DE PRODUCTO — regla de contraste sobre cristal SIN tocar la formula aprobada: el velo va SIEMPRE por debajo del cristal y el texto se ancla en la zona donde el velo supera el 70% de opacidad. Esto resuelve el mismo problema que prueba resuelve sumandole «un tinte plano al 20%» al velo del handoff, y lo resuelve sin modificar un valor declarado final. Injertar esto elimina el peor defecto de la ganadora.
- DE PRODUCTO — nomenclatura del catalogo intacta. Adoptar su inventario tal cual: <adr-item-nivel>, <adr-item-clase>, <adr-pestanias>, <adr-tarjeta-curso>, <adr-tarjeta-plan>, <adr-avatar> son selectores que docs/04 §3 YA declara y que no existen en compartido/componentes/. Nada que el catalogo ya nombre recibe nombre nuevo (ruta renombra item-nivel; prueba los usa sin advertir que no existen).
- DE PRODUCTO — «las maquetas se componen SOLO de piezas del catalogo». Cualquier artefacto dibujado de la ganadora (diagrama del simulador, representacion del certificado, mini-rutas) se compone de componentes del catalogo mas tokens, nunca de marcado ad hoc: asi sigue al sistema por construccion y no puede derivar cuando el sistema cambie.
- DE PRODUCTO — el hallazgo de regla 11 sobre el estado actual: landing.html maqueta a mano la tarjeta de curso y la tarjeta de plan. Se paga en este cambio, y antes de mover ese marcado a compartido/ se comprueba que ninguna otra pantalla dependa de el.
- DE PRODUCTO — cero movimiento automatico. Nada auto-rota ni auto-avanza, con lo que prefers-reduced-motion queda satisfecho por construccion y no hace falta parchearlo despues. Barato y blinda contra el carrusel que siempre aparece en el sprint 3.
- DE RUTA — la contradiccion de fuentes sobre el subrayado mango. El README del handoff (§Screens 1.9) pone subrayado en el H2 del pie ademas del H1; docs/04 §1 lo limita a uno por pantalla. La ganadora decide bien (heroe) pero no declara el conflicto: hay que registrarlo y corregir el README en el MISMO commit, para que las dos fuentes dejen de contradecirse en la proxima sesion.
- DE RUTA — el encuadre de regla 4 sobre el contenido inventado. Nombres de nivel, reparto de clases, cifras y precios en landing.contenido.ts son valores de negocio escritos en el codigo. Adoptar su formula: van con advertencia explicita y con condicion de salida declarada (desaparecen cuando exista el endpoint que los sirva), no como constantes silenciosas.
- DE RUTA — el inventario exacto de defectos vigentes como precondicion, no como nota al pie: landing.html tiene 201 lineas contra el limite de 150 de docs/01 §8, y landing.scss pesa 5.946 bytes contra el aviso de 6 kB. El troceo en secciones/ y la tokenizacion de landing.scss lineas 20-21 y 162 entran en el mismo commit que el rediseno, porque hoy cualquier linea que se sume dispara el aviso.
- DE RUTA — «estado como forma, nunca solo color» escrito como contrato de componente: completado = check-circle verde, actual = punto azul macizo + etiqueta «Actual», bloqueado = lock + borde suave + opacidad + texto explicativo. Es docs/04 §5 convertido en API, y va mas lejos que el sello de la ganadora. Con prueba que verifique los cuatro estados por icono ademas de por color.
- DE RUTA — la ausencia deliberada de chrome: una seccion resuelta solo con divisores de 1px en lugar de una cuarta tanda de tarjetas. Rompe la monotonia de rejilla-de-tarjetas de la ganadora sin inventar una sola superficie ni un solo token.
- DE RUTA — el tope explicito de solapes: maximo dos en toda la pagina. La ganadora tiene uno (-48px); dejar el limite escrito evita que el recurso se multiplique seccion a seccion hasta volverse ruido.

**Defectos graves detectados:**

- Ninguna de las tres trata el cristal y los velos como lo que las fuentes dicen que son: una ampliacion de paleta que exige ADR ANTES de escribir scss. Solo producto lo nombra; prueba lo condiciona a la opinion del propietario; ruta lo mete «en el mismo commit» como si tokenizar legitimara el valor. backdrop-filter — el pedido estrella del propietario — no existe en el sistema aprobado en ninguna forma, y es la mayor extension que este panel esta proponiendo.
- El velo aprobado usa rgb(10 19 33), pero Noche azul es #0E1B2E = rgb(14 27 46). Ese oscuro no esta en la tabla de colores del handoff ni en _tokens.scss: viene arrastrado del prototipo y hoy vive literal en landing.scss:20. Las tres lo heredan sin verlo. El ADR tiene que adoptarlo como token nombrado o reformular el velo sobre noche azul.
- #1b3557 (landing.scss:21) tampoco esta en la paleta aprobada, y #dbe6f5/#c6d5ea (linea 162) tampoco. Las tres proponen «ascenderlos a token». Promover un literal no lo aprueba: o entran en el ADR con justificacion, o se sustituyen por una mezcla de noche azul y azul profundo que si sale de la paleta.
- Segunda contradiccion de fuentes que NADIE detecto: el handoff (§Screens 1.5) y el landing actual ponen tres checks VERDES en las features del simulador (BPM, loop A-B, afinaciones FBE/GCF), que no son progreso ni aprobacion y por tanto contradicen la regla de color 3. Producto la reproduce; ruta y prueba la eliminan por accidente al cambiar a chips. Hay que decidirlo a proposito y dejarlo escrito.
- Deriva del mango en las tres: comillas decorativas y flecha de fuelle mango (prueba), flecha de fuelle mango (producto), borde mango en el circulo «meta» (ruta). La regla 2 enumera tres usos — subrayados, estrellas de dificultad y etiquetas «Nuevo»/«Recomendado» — y ninguno de estos cabe. O se amplia la enumeracion por ADR, o se quitan.
- Valores fuera de escala en las tres: -40px (ruta) y -44px (producto) fuera de la escala de espaciado 4/8/12/16/24/32/48/64/88; H1 a 38px en movil (producto) fuera de las siete escalas tipograficas; min-height 92vh (ruta) pisando el padding 104/96px que el handoff declara final; 30px de cifra (ruta y producto) cuando el token --adr-texto-cifra es 32px. Solo prueba acierta el token de cifra y el solape en escala.
- Prueba modifica el velo aprobado sumandole un tinte plano al 20%. El README manda recrear el heroe pixel a pixel; alterar la formula de tres paradas es cambiar un valor final. La regla de anclaje de producto (texto donde el velo supera el 70%) consigue el AA sin tocarla.
- Ruta renombra <adr-item-nivel> — declarado con ese selector en docs/04 §3 — a <adr-estacion-ruta>, admitiendo en el mismo parrafo que es ese componente. La regla 11 existe exactamente para impedir esto, y un renombre en el commit fundacional condena a las pantallas 8 y 9 a heredarlo.
- Ruta pone emojis en el copy propuesto (🔒 en el panel del heroe, ✓ y ● en la mini-ruta). docs/04 §2 y la regla 12 los prohiben sin matices, y ese copy vive en landing.contenido.ts, que es precisamente donde un emoji sobrevive a la revision.
- Producto rota el matiz del degradado de portada por indice de la clave del curso: fabrica colores fuera de la paleta por construccion. Es el unico mecanismo del panel que automatiza la deriva cromatica, y va listado como patron visual, no como riesgo.
- Producto convierte la banda de cifras en franja oscura de cristal cuando el handoff la define clara con borde inferior #DCE3EC, creando una cuarta zona oscura y dos oscuras consecutivas al inicio. La regla 4 enumera heroe, simulador y pie; no admite una cuarta.
- El marco de ventana con barra de cromo y tres puntos (producto en cuatro secciones, prueba en una) es un idioma visual que no aparece en ninguna fuente aprobada. En producto deja de ser un recurso y pasa a ser el lenguaje de la pagina.
- Prueba anexa a la landing aprobada una pieza de Fase 2 (verificador de certificado, pantalla 13) con un campo deshabilitado. No esta en el inventario de secciones del handoff y publicar un control muerto en la pagina de venta contradice el propio eje de la propuesta.
- Extension no declarada del catalogo: ruta agrega un quinto tinte `sobre-oscuro` a <adr-etiqueta>, que hoy tipa exactamente 'azul' | 'mango' | 'verde' | 'neutro' en etiqueta.ts. Es un cambio del catalogo aprobado y necesita el mismo tramite que un token nuevo.

### Lente: conversion

| Propuesta | Puntos | Comentario |
|---|---|---|
| ruta | 8 | Unica que convierte el patron Platzi numero uno en columna vertebral en vez de en una seccion mas. La especificacion §14.2 lista «Ruta de aprendizaje» PRIMERO entre lo que se toma de Platzi, y esta es la unica propuesta que lo pone sobre el pliegue: cuatro niveles con estados completado/actual/bloqueado, comunicados con icono ademas de color. Ademas es la unica que sube un PRECIO al heroe («Planes desde $34.900 →»): el diferenciador deliberado frente a FZ Academia (§1, «la opacidad de precios» es lo que NO se toma) ejecutado en la posicion de mas palanca de la pagina, no enterrado en la seccion 7. La rejilla asimetrica 2fr 1fr 1fr del catalogo es una decision de conversion disfrazada de maquetacion: tres tarjetas iguales dicen que suscripcion y compra suelta valen lo mismo, y no es cierto. Eliminar «362 videos publicados» es la jugada mas fina de las tres: es una senal de alternativa gratuita puesta justo antes del muro de pago. Y compartir <adr-ruta-niveles> con la pantalla 8 evita que la promesa de marketing y el producto se separen en tres sprints, que es como mueren las landings que convierten. PIERDE PUNTOS por tres cosas concretas: el testimonio es inventado y ni siquiera figura en su lista de riesgos (las otras dos si lo flagean); la barra de progreso al 0% en el heroe no motiva, informa al visitante de que no ha hecho nada — el efecto de progreso dotado necesita una ventaja de salida, no un cero; y no hay un solo chip que mate objeciones de pago, cobro o cancelacion mas alla de una nota de 12px. |
| prueba | 7 | El mejor motor de credibilidad de las tres y la unica honesta con la prueba social. La seccion 5 (comentarios reales del canal, citados literales, enlazados al video, y la regla explicita de que si no hay captura la seccion NO se renderiza) es prueba social concreta y disponible hoy, sin inventar un alumno. La linea de procedencia bajo la tira de cifras («Cifras publicas del canal @DiegoRomeroAcordeon») convierte una consigna publicitaria en un hecho comprobable por doce pixeles de copy. Y la tira de cuatro chips que sustituye al FAQ (PSE/Nequi, cancela cuando quieras, pasarela certificada, acceso inmediato) mata las cuatro objeciones de compra mejor que cualquier acordeon de preguntas; en Colombia el chip de medios de pago vale por si solo. Disciplina explicita de una sola accion azul por seccion. PERO NO TIENE RUTA DE APRENDIZAJE EN NINGUNA PARTE: ni camino, ni estados de nivel, ni barra de progreso. «Niveles que se desbloquean» queda como afirmacion de texto con un chip al lado. El patron Platzi mas replicado del mundo, el que la propia especificacion §14.2 lista primero y el que separa una academia de una playlist, simplemente no se dibuja. Eso es un techo duro. Encima quema una seccion completa en el verificador de certificados: Fase 2, campo deshabilitado en pantalla, dirigido a gente que YA tiene certificado — es decir, no al visitante que hay que registrar. Un campo muerto en una landing es friccion y anuncio de que la funcion no existe. La propia propuesta admite el riesgo de leerse como tablero de control y no como pagina de venta, y ese diagnostico es correcto. |
| producto | 6 | La idea rectora (ensenar el producto en vez de describirlo) es la mejor respuesta de las tres al problema de activos, y renderizar las maquetas con componentes reales del catalogo en lugar de capturas es tecnicamente elegante y ahorra la sesion de fotos. Pero la mete DETRAS DE PESTANIAS: por defecto se ve una de tres vistas, en movil con scroll horizontal, y la propia propuesta reconoce que dos tercios de los visitantes no veran el resto. Esconder la ruta de niveles tras un toque, en el dispositivo por el que llega la mayoria del trafico de YouTube, anula justo el patron que hace convertir a Platzi; es el mismo error que la propuesta «ruta» prohibe por escrito al vetar el carrusel. Peor todavia: el tour dibuja las pantallas 8, 9 y 12, que no existen — y la 12, el simulador, es FASE 3 segun §6.1. Vender con «capturas» de lo no construido no es un riesgo de diseno, es brecha entre promesa y entrega, y se cobra en reembolsos y en reclamos de soporte al mes de lanzar. Prueba social la mas debil de las tres: conserva «362 VIDEOS» (senal de alternativa gratuita junto al precio), el testimonio del cierre es inventado y no propone ningun otro mecanismo de prueba. Y es la mas cara de publicar: cinco componentes nuevos mas seis del catalogo declarados y sin implementar, todos con cobertura, antes de que la pagina vea un visitante. Peor retorno por semana de calendario de las tres. |

**Mejor propuesta:** ruta — Porque es la unica que hace del camino de aprendizaje la estructura de la pagina y no un argumento mas. Desde la lente de conversion mando tres cosas por delante de todo: (1) que el visitante VEA el progreso y la mecanica de desbloqueo antes de leer nada — la especificacion §14.2 pone «Ruta de aprendizaje» como el primer elemento tomado de Platzi, y «ruta» es la unica que lo dibuja sobre el pliegue, con estados por icono ademas de color y sin carrusel que los esconda en movil; (2) que el precio se vea sin registrarse — es la unica que sube una cifra al heroe («Planes desde $34.900 →»), que es exactamente el diferenciador declarado frente a FZ Academia ejecutado en la posicion de mayor palanca; (3) que cada seccion mueva a registrarse — nueve secciones, copy de una linea por bloque, chips de dato en vez de parrafos, y cero secciones dedicadas a funciones de Fase 2 o a publico que no es el visitante. A eso suma dos decisiones que las otras no toman: eliminar «362 videos publicados» (senal de alternativa gratuita junto al muro de pago) y romper la simetria del catalogo a 2fr 1fr 1fr para que la suscripcion no parezca equivalente a un tutorial suelto. Y el componente de ruta compartido con la pantalla 8 hace que la promesa de la landing y el producto no puedan divergir, que es la unica forma de que una landing siga convirtiendo a los seis meses. «prueba» gana en credibilidad y «producto» en demostracion, pero a «prueba» le falta el patron central y «producto» lo esconde tras pestanias mientras promete una funcion de Fase 3.

**Ideas rescatadas de las propuestas perdedoras:**

- DE «prueba» — LA SECCION DE COMENTARIOS REALES DEL CANAL (seccion 5) con su regla dura: citas literales de comentarios publicos de YouTube, maximo 20 palabras, con enlace al video, y «si no hay comentarios capturados, la seccion no se renderiza». Es el injerto de mayor valor de todo el panel: sustituye el testimonio inventado de «ruta» por prueba social verificable disponible HOY, sin esperar a que existan alumnos con nivel aprobado. Y el mismo componente muta a «NIVEL 1 APROBADO · MAR 2026» cuando los haya, sin tocar plantilla.
- DE «prueba» — LA TIRA DE CUATRO CHIPS QUE SUSTITUYE AL FAQ, bajo los planes: PSE/Nequi/tarjeta, cancela cuando quieras, pasarela certificada, acceso inmediato. Mata las cuatro objeciones de compra en tres palabras cada una, sin acordeon y sin una seccion nueva. En Colombia el chip de medios de pago quita por si solo un bloqueo real de conversion. «ruta» solo tiene una nota de 12px donde deberia tener esto.
- DE «prueba» — LA LINEA DE PROCEDENCIA BAJO LA TIRA DE CIFRAS: «Cifras publicas del canal @DiegoRomeroAcordeon». Doce pixeles de copy que convierten cuatro numeros de consigna publicitaria en cuatro hechos comprobables. Es el detalle mas barato y de mayor retorno del panel entero.
- DE «prueba» — EL CHIP DE EVIDENCIA <adr-sello-verificacion> adosado al pie de cada afirmacion (neutro por defecto, verde solo cuando significa verificado o aprobado). Hace legible el patron «afirmo, luego pruebo» y encaja sin friccion en las tarjetas de «Dentro de un nivel» de la ganadora.
- DE «prueba» — EL ENLACE «Verificar» CON ICONO seal-check EN LA NAV, unico item del menu con icono. Senal de confianza gratis, sin gastar una seccion. Pero SIN el verificador de certificados en la landing: eso se queda fuera hasta Fase 2.
- DE «prueba» — SU REGLA DE HONESTIDAD sobre funciones de Fase 2 («o entra deshabilitado con nota honesta, o la seccion se pospone: no hay tercera opcion»). Aplicarla al simulador en la ganadora, que es Fase 3 segun §6.1 y hoy se presenta como si funcionara.
- DE «producto» — LAS MAQUETAS COMPUESTAS CON PIEZAS REALES DEL CATALOGO (<adr-item-nivel>, <adr-item-clase>, <adr-barra-progreso>) como contenido del marcador de imagen, en lugar de un degradado mudo. Es mejor respuesta al «no hay fotos» que la geometria abstracta de «ruta», y ademas se autoactualiza cuando esas piezas evolucionen. INJERTAR SIN LAS PESTANIAS: apiladas y siempre visibles, nunca tras un toque.
- DE «producto» — EL DEGRADADO DE MARCA DETERMINISTA POR CLAVE DE CURSO (matiz rotado por indice + icono Phosphor duotone gigante al 8%) para las portadas sin foto. Ninguna portada se repite y ninguna parece banco de imagenes; resuelve mejor las tres portadas que el marcador generico.
- DE «producto» — FUNDIR TESTIMONIO Y CIERRE EN UN SOLO BLOQUE OSCURO. «ruta» gasta dos secciones (Prueba + Cierre) en lo que cabe en una; en movil eso es un pantallazo entero de scroll extra justo antes del CTA final, que es el peor sitio para pedirle paciencia al visitante.
- DE «producto» — EL «ESCALADO HONESTO» EN MOVIL: por debajo de 768px la ventana RECORTA a su zona util en lugar de encoger todo hasta lo ilegible. Protege directamente la conversion en el dispositivo mayoritario y aplica igual a la ruta y al diagrama del simulador de la ganadora.
- DE «producto» — @defer (on viewport) EN LOS BLOQUES PESADOS Y content-visibility bajo el pliegue. En 3G desde YouTube, el LCP es conversion; «ruta» mete dos superficies con backdrop-filter y no propone diferido de montaje.
- DE «producto» — LA REGLA «CERO MOVIMIENTO AUTOMATICO» declarada por construccion. Evita el parche posterior de prefers-reduced-motion y elimina el carrusel automatico como tentacion futura.

**Defectos graves detectados:**

- NINGUNA DE LAS TRES OFRECE UNA MUESTRA GRATIS. No hay clase abierta, ni primer video sin registro, ni «prueba el simulador con un fragmento». Las tres piden registro o pago con cero degustacion del producto. Es el reductor de friccion mas potente del modelo Platzi y del propio referente Vallenato Master, y esta ausente en el panel entero. Para un publico que llega de un canal donde ya consume gratis, pasar de 362 videos gratuitos a un muro de $39.900/mes sin puente intermedio es el salto que mata la conversion. Falta un bloque «Clase 1 del nivel 1, gratis y sin cuenta».
- TESTIMONIO FABRICADO EN «ruta» Y EN «producto». Ambas publican una cita de alumno que no existe («En tres meses pase el nivel 1...»). «producto» al menos lo flagea y propone bloquearlo; «ruta» ni lo menciona en sus diez riesgos. Sobre la marca personal de una persona real es problema legal y reputacional, y desde mi lente ademas es prueba social que el visitante descuenta: una cita anonima sin enlace no convence a nadie que ya haya visto cien landings.
- «prueba» NO DIBUJA LA RUTA DE APRENDIZAJE EN NINGUNA PARTE. Sin camino, sin estados de nivel y sin barra de progreso, la pagina no puede demostrar que esto es una academia y no una playlist — que es literalmente su propio titular. Es la ausencia mas cara del panel.
- «producto» ESCONDE DOS DE SUS TRES VISTAS DE PRODUCTO TRAS PESTANIAS, con la ruta de niveles como una de las escondidas, y en movil con scroll horizontal. En el dispositivo por el que llega la mayoria del trafico, el patron central de conversion depende de que el visitante toque algo. Su propia lista de riesgos lo admite y no lo corrige.
- «producto» VENDE EL SIMULADOR CON UNA MAQUETA QUE SIMULA UNA PANTALLA DE FASE 3 (§6.1, pantalla 12) Y UN REPRODUCTOR DE FASE 1 SIN CONSTRUIR. No es riesgo de deriva de UI: es brecha entre promesa y entrega. El visitante paga por lo que vio funcionando en la landing, entra y no esta. Eso son reembolsos, reclamos y resenas negativas en el peor momento del ciclo de vida del producto.
- «prueba» PONE UN CAMPO DE FORMULARIO DESHABILITADO EN LA LANDING (verificador de certificados, Fase 2). Un control muerto en una pagina de venta es friccion pura y anuncia que la funcion no existe. Ademas la seccion entera apunta a quien YA tiene certificado, no al visitante que hay que registrar.
- LAS TRES DEJAN CIFRAS Y PRECIOS COMO CONSTANTES EN landing.contenido.ts. Ya es deuda declarada frente a la regla 4, pero en una pagina cuyo argumento entero son numeros, un dato caducado deja de ser un detalle tecnico y pasa a ser una mentira visible para el visitante. «prueba» es la unica que lo nombra con esa gravedad; la ganadora lo hereda igual.
- «ruta» MUESTRA UNA BARRA DE PROGRESO AL 0% EN EL HEROE. El efecto de progreso dotado funciona regalando una ventaja de salida, no exhibiendo un cero. Tal como esta, el primer mensaje visual de la pagina es «no has hecho nada» y «te faltan 96 clases». Se arregla o se quita.
- «ruta» INVENTA LOS NOMBRES DE NIVEL Y EL REPARTO DE 24 CLASES POR NIVEL. La especificidad es justo lo que hace persuasiva la ruta, y por eso una especificidad falsa es peor que ninguna: si Diego dice otra cosa, la pagina promete un plan de estudios que el producto no tiene. Lo flagea, pero no puede publicarse sin confirmacion.
- LAS TRES DAN POR HECHO EL backdrop-filter COMO PATRON CENTRAL PORQUE EL PROPIETARIO PIDIO TRANSPARENCIA. Es caro en gama baja y el publico llega de YouTube en celulares modestos. Las tres proponen @supports de respaldo, pero ninguna pone un presupuesto de rendimiento medible ni condiciona el patron a el. Si el velo cuesta un segundo de LCP en movil, el gusto estetico del propietario le sale en conversion.

### Lente: viabilidad

| Propuesta | Puntos | Comentario |
|---|---|---|
| ruta | 9 | Es la unica propuesta cuyo diagnostico tecnico verifique linea por linea y salio intacto. Acierta los dos bloqueos duros: landing.html tiene 201 lineas contra el limite de 150 de docs/01 §8, y landing.scss pesa 5946 B contra un aviso de 6144 B en angular.json — o sea que HOY, sin agregar nada, esta al 96,8% del presupuesto de estilos por componente. Y no lo deja como advertencia: enumera los nueve subcomponentes de seccion que lo resuelven y deja landing.html en ~12 lineas, lo que ademas reparte el .scss en nueve presupuestos independientes en vez de uno saturado. La auditoria de iconos es correcta al detalle: 'music-notes', 'flag-banner' y 'metronome' efectivamente NO estan en registro-iconos.ts, y los seis que da por existentes (lock, check-circle, play-circle, seal-check, certificate, star) si estan. Es la unica que detecta que adr-etiqueta solo tiene tintes azul/mango/verde/neutro y que hace falta agregar 'sobre-oscuro' antes de poner un chip sobre noche azul — lo verifique en etiqueta.ts. Rendimiento: cero animacion, cero listener de scroll, no toca adr-nav-publica; en zoneless eso es lo mas barato posible, no hay una sola fuente de deteccion de cambios que administrar. El presupuesto de backdrop-filter es el mas estricto de las tres (maximo dos superficies, @supports con color macizo, blur a 8px bajo 768px, apagado con prefers-reduced-transparency), que es exactamente lo que hace falta para celulares modestos que llegan de YouTube. El solape de la cinta de cifras es una tarjeta BLANCA OPACA: no hay ningun riesgo de contraste. Y el mecanismo de activos —<adr-marco-imagen [fuente]="null"> pinta el marcador— es el unico de los tres que se puede cubrir con Vitest de verdad, y ella misma nombra las tres pruebas que importan. Resta: no menciona el ADR que docs/04 §1 exige para tokens nuevos; inventa <adr-estacion-ruta> cuando docs/04 §3 ya declara <adr-item-nivel>, lo que sembraria deriva con el catalogo; y 19 archivos nuevos con cobertura ≥80% es un sprint real, no un retoque. |
| prueba | 6 | Tecnicamente honesta en lo que declara y solida en higiene de carga (content-visibility: auto, width/height declarados, lazy bajo el pliegue), y tiene el mejor expediente de iconos de las tres: TODOS los que nombra —lock-open, x-circle, credit-card, clock, seal-check, certificate, play-circle, list, whatsapp-logo— ya estan en registro-iconos.ts, asi que no necesita pasar por npm run iconos:generar. El panel cabalgado tambien es opaco, sin riesgo de contraste. Pero su mecanismo estrella falla desde mi lente: degradar con background-image + image-set() apuntando a archivos que no existen significa que cada carga dispara peticiones que devuelven 404, con error en consola y peticiones fallidas marcadas por Lighthouse. Se vende como 'contrato de CSS puro sin codigo' y en realidad es un contrato que solo funciona porque el navegador se traga un fallo; y la propia propuesta admite que ese comportamiento 'es dificil de cubrir con Vitest'. En un repo con la regla 10 y un gate de cobertura, un mecanismo intestable en el corazon de la pagina es una decision cara. Segundo problema: la seccion 5 —su bloque de prueba social mas humano— depende de capturar comentarios reales del canal, trabajo externo que no esta hecho, y la propia propuesta acepta que si no se hace la seccion no se publica; es decir, el angulo puede salir a produccion mutilado. Tercero: <adr-verificador-certificado> construye interfaz de Fase 2 que no verifica nada, con ramas que hay que cubrir para sostener el 75% de branches — codigo especulativo con costo de cobertura y cero funcion. Cuarto: la nav transparente que se vuelve solida a los 80px exige meter estado de scroll en adr-nav-publica, que hoy no tiene nada de eso (solo un signal 'abierto') y que usan todas las pantallas; bajo zoneless eso pide IntersectionObserver con un centinela, no un listener de scroll escribiendo un signal en cada frame, y la propuesta no lo especifica. |
| producto | 5 | Tiene la mejor tesis de producto y la peor ejecucion tecnica de las tres, y no es por ambicion: es por dos defectos concretos. El primero es un fallo de accesibilidad estructural, no cosmetico. La franja de cifras es una tarjeta de cristal con fondo blanco al 6% montada -44px sobre el limite heroe/niebla, 'mitad sobre oscuro, mitad sobre claro', con cifras en BLANCO y divisores en --adr-oscuro-borde (blanco al 12%). La mitad que cae sobre Niebla #F6F8FB queda con texto blanco sobre un fondo casi blanco: ratio cercano a 1,1:1 contra los 4,5:1 que exige docs/04 §5, y los divisores desaparecen. No se arregla con un ajuste de opacidad — es el patron el que esta mal, porque un panel translucido no puede llevar el mismo color de texto sobre dos fondos opuestos. Y esta en el segundo bloque de la pagina. El segundo defecto es de planificacion: afirma que <adr-tour-producto> 'saca ~90 lineas y mantiene la landing bajo el limite de 150', con once secciones mas densas que las siete actuales que ya suman 201 lineas. No cierra la cuenta, y ademas es la unica de las tres que no menciona el presupuesto de 6 kB por componente cuando landing.scss ya esta en 5946 B — el aviso salta con el primer commit. A eso se suma que las maquetas meten UI falsa en el DOM (controles 'inertes', botones de acordeon, listas de clases) sin decir una palabra sobre inert, orden de tabulacion ni aria: una maqueta con elementos enfocables es una trampa de accesibilidad. Y el heroe carga la ventana de producto completa en el primer pliegue, que es el fold mas pesado de las tres en gama baja. Lo hace bien donde nadie mas: es la unica que exige un ADR 0008 explicito para los tokens nuevos, la unica que usa @defer (on viewport), la unica que se compromete a cero movimiento automatico, y la que mas apalanca el catalogo (item-nivel, item-clase, tarjeta-curso, tarjeta-plan, pestanias sirven a las pantallas 7/8/9/11). Pero 13 componentes de los cuales tres son maquetas de marketing que imitan pantallas que aun no existen es el mayor costo con el menor blindaje contra la deriva. |

**Mejor propuesta:** ruta — Gana porque es la unica que llega con el diagnostico correcto de las restricciones reales del repo y con el remedio ya escrito, no como advertencia. Verifique sus tres afirmaciones tecnicas centrales y las tres son ciertas: landing.html en 201 lineas contra el tope de 150, landing.scss en 5946 B contra un aviso de 6144 B, y la ausencia exacta de los tres iconos que dice que faltan. Ninguna otra llega con ese nivel de correspondencia con el codigo. Desde la lente de viabilidad importa mas: (1) es la mas barata en tiempo de ejecucion — cero animacion, cero listener de scroll, no toca adr-nav-publica, lo que en Angular 21 zoneless significa que no hay ni una fuente de deteccion de cambios que administrar; (2) su unico solape es una tarjeta blanca OPACA, asi que a diferencia de 'producto' no arrastra un fallo de contraste AA en la segunda seccion de la pagina; (3) su presupuesto de backdrop-filter es el unico que se puede defender ante un Android modesto (dos superficies como maximo, @supports con macizo, blur reducido en movil, apagado con prefers-reduced-transparency); (4) su mecanismo para funcionar hoy sin fotos es un componente con entrada `fuente: string | null`, que se prueba con Vitest en tres lineas, frente al de 'prueba' que se apoya en peticiones 404 y es intestable por construccion; (5) su componente principal, <adr-ruta-niveles>, es literalmente la pantalla 8 (/curso/{slug}), asi que el gasto de cobertura del bloque mas caro se amortiza en el producto y no solo en marketing. Sigue siendo un sprint grande —19 archivos nuevos bajo un gate de 80/75— pero es el unico de los tres cuyo costo esta bien contado y cuyos riesgos vienen con mitigacion escrita en el componente, no con un parrafo de buenas intenciones.

**Ideas rescatadas de las propuestas perdedoras:**

- De 'producto': el ADR 0008 explicito para los tokens nuevos (--adr-velo-lateral, --adr-velo-inferior, --adr-cristal-fondo, --adr-cristal-desenfoque, --adr-degradado-marcador-oscuro/-claro). docs/04 §1 y la cabecera de _tokens.scss exigen ADR para proponer un valor nuevo; 'ruta' solo dice 'se tokenizan en el mismo commit', que salta el proceso. Injertar el ADR es gratis y evita que el rediseno entre por la puerta de atras.
- De 'producto': mover el manifiesto de activos a frontend/src/app/disenio/activos.ts en vez de dejarlo dentro de landing.contenido.ts. <adr-marco-imagen> vive en compartido/ y lo van a consumir las pantallas 7 y 8; si las rutas de foto viven en un archivo de la landing, la primera pantalla interna que necesite una portada duplica el mapa. Un solo manifiesto en disenio/ mantiene la promesa de 'cambiar cinco null por cinco rutas' valida para todo el proyecto.
- De 'producto': @defer (on viewport) en todo lo que va bajo el primer pliegue (ruta, catalogo, planes, prueba, cierre). 'ruta' no lo menciona y es la palanca de rendimiento mas barata que existe en Angular 21 para el publico objetivo — celulares modestos que llegan de YouTube. Solo el heroe y la cinta de cifras deben entrar en el bundle critico.
- De 'producto': renombrar <adr-estacion-ruta> a <adr-item-nivel>, que docs/04 §3 YA declara en el catalogo, y sumar <adr-item-clase>, <adr-tarjeta-curso> y <adr-tarjeta-plan> como componentes de catalogo en el mismo lote. 'ruta' ya construye tarjeta-curso y tarjeta-plan pero inventa nombre para la estacion; alinear la nomenclatura con el catalogo declarado hace que el trabajo pague tambien las pantallas 7, 8 y 9 en vez de solo la landing.
- De 'producto': la regla escrita de CERO movimiento automatico. Nada auto-rota, nada se anima solo. 'ruta' de hecho no tiene animacion, pero conviene dejarlo escrito como restriccion del componente para que nadie agregue un carrusel o un contador animado en el siguiente sprint y obligue a parchear prefers-reduced-motion despues.
- De 'prueba': content-visibility: auto en las secciones bajo el pliegue, mas width/height declarados y loading=lazy en cada medio. Son dos lineas de CSS por seccion, no cuestan bundle, y eliminan de raiz el salto de diseno (CLS) y el costo de render de secciones que nadie ha visto todavia.
- De 'prueba': la disciplina de usar solo iconos ya presentes en registro-iconos.ts. 'prueba' no necesita generar ni uno; 'ruta' pide tres (music-notes, flag-banner, metronome). Al menos la estacion 'meta' puede resolverse con seal-check o certificate, que ya existen, y asi npm run iconos:generar deja de ser un paso previo obligatorio del rediseno.
- De 'prueba': la linea de procedencia bajo la cinta de cifras ('Cifras publicas del canal @DiegoRomeroAcordeon'). Un caption de 12px, costo cero, y convierte cuatro numeros de consigna publicitaria en dato comprobable. Encaja perfecto en el <adr-dato> que 'ruta' ya construye.
- De 'prueba': la regla 'mejor ausente que fabricada' — una seccion que no se renderiza si su dato no existe. 'ruta' publica una cita de alumno sin verificar en la seccion de prueba, que es exactamente el riesgo reputacional que 'prueba' y 'producto' flagean. El bloque debe estar detras de una guarda de contenido: si no hay testimonio real, no se pinta y la mini-ruta del alumno se cae con el.
- De 'prueba': el marco de dispositivo con barra superior de tres puntos para el hueco del simulador. Convierte el marcador CSS de 'ruta' en algo que se lee como captura de producto sin necesitar la captura. Injertarlo como VARIANTE de <adr-marco-imagen> (variante='ventana'), no como componente nuevo, para no sumar otro archivo al conteo de cobertura.
- De 'prueba' y 'producto' a la vez: si el propietario insiste en que la nav cambie al hacer scroll, hacerlo con un centinela + IntersectionObserver, nunca con un listener de scroll escribiendo un signal. adr-nav-publica hoy solo tiene un signal 'abierto' y la usan todas las pantallas; bajo zoneless un signal escrito en cada frame de scroll dispara deteccion de cambios global 60 veces por segundo en el dispositivo mas debil del publico.

**Defectos graves detectados:**

- BLOQUEO COMPARTIDO Y VERIFICADO: frontend/src/app/funcionalidades/landing/landing.scss pesa 5946 bytes contra un maximumWarning de 6 kB (6144 B) en angular.json, y landing.html tiene 201 lineas contra el tope de 150 de docs/01 §8. Cualquiera de las tres propuestas rompe ambos limites en el primer commit. La particion en componentes de seccion NO es opcional en ninguna de las tres, y solo 'ruta' y 'prueba' la enumeran; 'producto' afirma que un solo componente (el tour) la mantiene bajo 150 lineas con once secciones, lo cual no cierra.
- VERIFICADO EN EL CODIGO: landing.scss tiene colores literales fuera de token en las lineas 20-21 (rgb(10 19 33 / 88%), #1b3557, #0e1b2e) y en la 162 (#dbe6f5, #c6d5ea). Viola la regla 15 y la cabecera de _tokens.scss, que dice literalmente que un valor escrito a mano es un defecto de revision. Las tres propuestas lo detectan, pero ninguna puede agregar un solo degradado mas hasta que esos literales esten tokenizados y respaldados por un ADR.
- 'producto' — FALLO DE CONTRASTE AA ESTRUCTURAL: la franja de cifras es un panel de cristal con fondo blanco al 6% montado -44px sobre el limite heroe/niebla, con cifras en blanco y divisores en --adr-oscuro-borde (blanco al 12%). La mitad que queda sobre Niebla #F6F8FB deja texto blanco sobre fondo casi blanco (ratio cercano a 1,1:1 frente a los 4,5:1 exigidos por docs/04 §5) y los divisores se vuelven invisibles. No es ajustable con opacidad: un panel translucido no puede llevar el mismo color de texto sobre dos fondos opuestos. Esta en el segundo bloque de la pagina.
- 'prueba' — DEGRADACION POR 404: apoyar la ausencia de fotos en background-image + image-set() apuntando a archivos inexistentes provoca una peticion fallida por hueco en cada carga, con error de consola y penalizacion en auditoria. Se presenta como 'contrato de CSS puro, cero codigo, cero JavaScript' pero solo funciona porque el navegador absorbe un fallo, y ademas es intestable — la propia propuesta lo admite. En un repo con gate de cobertura 80/75, poner el mecanismo central de la pagina fuera del alcance de Vitest es una decision cara.
- 'prueba' y 'producto' — la nav que cambia de transparente a solida al hacer scroll obliga a meter estado de scroll en adr-nav-publica, que hoy solo tiene un signal 'abierto' (64 lineas) y que consumen todas las pantallas. Bajo Angular 21 zoneless, un listener de scroll que escribe un signal dispara deteccion de cambios global en cada frame, justo en los celulares modestos que son la mayoria del trafico. Ninguna de las dos especifica IntersectionObserver, que es la unica forma sensata de hacerlo.
- VERIFICADO: adr-etiqueta solo admite los tintes azul | mango | verde | neutro (etiqueta.ts, TinteEtiqueta). Cualquier chip sobre noche azul necesita agregar la variante 'sobre-oscuro' ANTES de maquetar. Solo 'ruta' lo detecta; 'producto' da por hecho que puede usar adr-etiqueta neutra sobre fondo oscuro sin verificar como se pinta el tinte neutro ahi.
- Solo existen 11 componentes en compartido/componentes/ frente a los ~30 que declara el catalogo de docs/04 §3. Faltan avatar, tarjeta, pestanias, item-nivel, item-clase, tarjeta-curso, tarjeta-plan, estado-vacio, esqueleto, panel-lateral y mas. Las tres propuestas construyen entre 9 y 19 componentes nuevos bajo un umbral de 80% en statements/lines/functions y 75% en branches. Solo 'ruta' nombra las conductas concretas que hay que probar (los cuatro estados de la estacion, el marcador cuando fuente es null, que no se pierdan estaciones al cambiar de orientacion); las otras dos tratan la cobertura como un costo de calendario sin decir que se prueba.
- 'producto' — las maquetas meten interfaz falsa en el DOM (controles 'inertes' en la barra de cromo, botones de acordeon, lista de clases) sin una palabra sobre inert, orden de tabulacion o aria-hidden. Una maqueta decorativa con elementos enfocables rompe la navegacion por teclado que exige docs/04 §5, y en la seccion del heroe ademas es el fold mas pesado de las tres propuestas en gama baja.
- 'prueba' — <adr-verificador-certificado> construye interfaz de una funcion de Fase 2 que no verifica nada. Es codigo especulativo con ramas que hay que cubrir para sostener el 75% de branches, y contradice el mensaje de su propia seccion. O no entra, o entra sin logica y sin ramas que cubrir.

---

## Nota sobre las cifras de inscritos (añadida el 2026-08-15)

Las tarjetas de este documento mostraban **«184 alumnos»** y **«281 alumnos»**. Eran cifras
de la maqueta de diseño, **no del negocio**, y se copiaron tal cual a `landing.contenido.ts`.
Llegaron a producción.

Eran falsas por construcción: el backend no expone ningún controlador, así que no existía ni
un solo inscrito. Y contradecían la disciplina que este mismo documento defiende — a 700 px
de distancia la página aplicaba dos varas incompatibles: cita verificable con enlace para los
testimonios («mejor ausente que fabricada»), cifra inventada para los inscritos.

**La regla, a partir de ahora:** el campo `alumnos` va en `null` hasta que `GET /api/cursos`
sirva el conteo real. El mecanismo de prueba social sigue aprobado; lo que no se acepta es
escribirlo a mano. Con cero inscritos, el mecanismo produce **nada**, no 184.
