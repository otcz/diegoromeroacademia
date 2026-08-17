# ADR 0012 · Doble tema claro/oscuro en todo el sitio, sobre una capa semántica de tokens

**Estado:** aceptado
**Fecha:** 2026-08-16
**Deciden:** Oscar Tomás Carrillo Zuleta

---

## Contexto

El handoff de la aplicación del estudiante (`docs/handoff-disenio/app-estudiante`) trae las
trece pantallas resueltas en **dos temas**: oscuro por defecto y claro alternativo, con
interruptor en la barra superior, otro en Ajustes y persistencia.

El sistema «Azul rey» tenía un solo tema. Es más: `global.scss` declaraba
`color-scheme: only light` justamente para **renunciar** al tema oscuro automático de Chrome,
porque ese repintado ciego se llevaba por delante las medidas del [ADR 0009](0009-contraste-aa-de-las-tintas-de-texto.md).
La nota decía que la línea cambiaría «el día que exista un modo oscuro nuestro». Este es ese día.

Quedaba por decidir hasta dónde llega. El handoff cubre la aplicación tras iniciar sesión; la
portada y el acceso son otro paquete y no traen variante oscura. **El propietario decidió que
llegue a todo el sitio.**

## Decisión

**Un solo interruptor de tema para todo el producto, resuelto con una capa semántica de tokens
que conmuta por `data-theme` en el elemento raíz.**

### Las dos capas de `_tokens.scss`

| Capa | Nombres | ¿Conmuta? | Ejemplo |
|---|---|---|---|
| **Paleta** | `--adr-color-*`, nombres de COLOR | No | `--adr-color-mango`, `--adr-color-azul-rey` |
| **Semántica** | nombres de PAPEL | **Sí** | `--adr-fondo`, `--adr-superficie`, `--adr-texto-3` |

Una pantalla consume la capa semántica. Escribir `--adr-color-niebla` en un componente lo deja
clavado en claro, y eso es exactamente lo que produce un tema oscuro a medias: la mitad de la
interfaz obedece al interruptor y la otra mitad no.

La paleta se usa solo donde el color **es** el mensaje y no depende del tema: el mango del
subrayado de marca, el verde de WhatsApp, los cuatro colores de Google, el papel del certificado
y las superficies que son oscuras en ambos temas (el reproductor, la tarjeta de regalo).

### Los nombres anteriores quedan como alias

`--adr-color-tinta`, `--adr-color-borde-divisor`, `--adr-color-pista-barra`, `--adr-sombra-tarjeta`
y los tintes de etiqueta ya nombraban un papel, no un color. Pasan a **apuntar** a la capa
semántica —no a duplicar su valor—, y con eso la portada y el catálogo entero siguen el tema sin
tocar doscientas declaraciones.

No se renombraron en este cambio a propósito: mezclar la introducción del tema oscuro con un
renombrado masivo produce un diff irrevisable, y un renombrado a ciegas es justo como se cuela
un color en el sitio equivocado.

### Cómo se resuelve el tema

1. Lo que el alumno eligió y quedó guardado (`localStorage`, clave `adr-tema`).
2. Si nunca eligió, `prefers-color-scheme`.
3. Si el navegador no lo declara, **claro** — que es el diseño aprobado de la portada.

La preferencia del sistema se lee **una vez** y se materializa como atributo. No se deja como
`@media (prefers-color-scheme)` en el CSS: con la consulta de medios, el interruptor no puede
ganarle al sistema sin duplicar cada regla del tema, y el resultado es el clásico tema en el que
pulsar «claro» no hace nada si el portátil está en oscuro.

Hay un **guion inline en `index.html`** que aplica el atributo antes del primer pintado. Es una
copia deliberada de cuatro líneas de la lógica del servicio: `TemaServicio` no corre hasta que
Angular arranca, y para entonces la página ya se pintó. La portada va prerenderizada, así que sin
el guion el fogonazo blanco sería el 100% de las visitas. `tema-servicio.spec.ts` fija la clave y
el valor del atributo para que el guion no pueda quedarse atrás en silencio.

## Alternativas consideradas

| Alternativa | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Doble tema en todo el sitio** (elegida) | Un solo interruptor; coherente de punta a punta; ninguna pantalla es la excepción | Obliga a que la portada tenga variante oscura, que el handoff no diseñó | — |
| Doble tema solo tras iniciar sesión | La portada conserva intacto su diseño aprobado | El salto se ve al entrar, y el acceso queda en la frontera sin saber a qué grupo pertenece | Decisión del propietario |
| Solo oscuro en la aplicación | La mitad del trabajo de tokens desaparece | Se tira la paleta clara que el handoff ya trae medida | Desperdicia trabajo hecho |
| Guardar un tercer valor «automático» | Permite volver a seguir al sistema | Obliga a distinguir «elegí claro» de «sigo al sistema y hoy toca claro», y esa diferencia no la ve nadie | Complejidad sin señal |

## Consecuencias

**Positivas**

- El contraste está **medido y defendido por una prueba** (`disenio/contraste.spec.ts`), no por
  una revisión visual. Mide pares de tokens compuestos sobre su pila real de superficies, en los
  dos temas, y falla sobre el valor que hay que cambiar.

  | Tema | texto-1 | texto-2 | texto-3 | texto-4 | texto-5 | enlace | peor pastilla |
  |---|---|---|---|---|---|---|---|
  | Claro (sobre tarjeta) | 18,29 | 12,47 | 9,98 | 6,06 | 5,12 | 6,66 | rojo 4,54 |
  | Oscuro (sobre tarjeta) | 18,79 | 13,62 | 9,94 | 7,18 | 5,31 | 8,07 | morado 6,63 |

  Ninguna medida baja del 4,5:1 que exige `docs/04 §5`. La más justa es el rojo de estado en
  claro, con 4,54.

- Se corrigieron **tres valores del handoff que no cumplían AA**, con el mismo criterio del
  ADR 0009: el quinto escalón de texto en claro (`#8b90ad` → `#5f6f86`, de 3,1 a 4,81), el mismo
  en oscuro (45% → 50%, de 4,40 a 5,31) y el verde de estado en claro (`#0b8f5a` → `#0a7d4f`, de
  4,12 a 5,17).

- La escala del handoff se **condensó**: once escalones de texto y siete de borde pasan a cinco y
  tres. Once niveles no son una jerarquía — nadie distingue `.72` de `.70` y el segundo acaba
  usándose por accidente. Hay una prueba que verifica que los cinco escalones bajan de contraste
  en orden en ambos temas.

**Negativas — lo que se acepta pagar**

- **La portada tiene ahora una variante oscura que nadie diseñó.** Se deriva de los mismos tokens
  semánticos y cumple contraste, pero no está aprobada visualmente. Es la consecuencia directa de
  elegir «todo el sitio» y hay que revisarla con el propietario.
- Conviven dos juegos de nombres —los semánticos y sus alias— hasta que se haga el renombrado.
- `color-scheme` ya no se declara en `global.scss`: lo fija cada tema. Un tema nuevo que olvide
  declararlo dejaría los controles nativos del navegador con el esquema del anterior.

**Qué obligaría a revisar esta decisión**

- Que el propietario, al ver la portada en oscuro, prefiera dejarla fija en claro. Sería volver a
  la opción «solo en la aplicación», y el cambio está acotado: mover el atributo del elemento raíz
  al armazón.
- Que aparezca una tercera variante de marca (por ejemplo, alto contraste).
