# Proceso · Construcción de la aplicación del estudiante

**Fecha:** 2026-08-16 · **Regla 14:** todo proceso queda documentado al terminarlo.

Recreación en Angular del handoff `docs/handoff-disenio/app-estudiante`: las trece pantallas
que hay tras iniciar sesión, más el doble tema en todo el sitio.

---

## 1. Qué entró y qué se decidió antes de escribir código

El paquete traía tres prototipos `.dc.html` (la aplicación responsive completa, los mockups de
móvil y tablet, y las exploraciones del login), un README con tokens y comportamientos, y dos
imágenes. Tres cosas del handoff **chocaban** con las reglas del proyecto, y las decidió el
propietario antes de empezar:

| Conflicto | Handoff | Decisión |
|---|---|---|
| Tipografía | Archivo, familia única | **Se conserva** Bricolage Grotesque + Instrument Sans. Se añade lo que el handoff aporta y no existía |
| Tema | Oscuro por defecto + claro | **Doble tema en todo el sitio**, portada incluida — [ADR 0012](../adr/0012-doble-tema-en-todo-el-sitio.md) |
| Iconos | Trazo tipo Lucide, 13–20 px | **Phosphor duotone** (regla 12, ADR 0005). Cada icono traducido a su equivalente |

Las rutas las resolvió [ADR 0013](../adr/0013-rutas-de-la-aplicacion-del-estudiante.md): el
handoff llama a las suyas «sugeridas», así que manda la especificación donde ya definía una.

---

## 2. Orden en que se construyó

1. **Capa semántica de tokens** y servicio de tema. Es la base: sin ella, cada pantalla habría
   nacido clavada en un tema.
2. **Migración de la portada y el catálogo** a los tokens semánticos. Los nombres anteriores
   quedaron como alias, así que fueron ~25 cambios con criterio en vez de 200 mecánicos.
3. **Armazón**: barra lateral, barra superior, navegación inferior, panel del carrito.
4. **Modelos y servicios** con datos simulados, uno por dominio.
5. **Reproductor y simulador de pisadas** — el riesgo técnico estaba aquí.
6. **Las trece pantallas.**
7. **Pruebas, ADR y esta documentación.**

---

## 3. Lo que se encontró por el camino

**Un fallo real en el simulador, cazado por su prueba.** Dentro del bucle de botones, `$index`
es el del BOTÓN y tapa al de la fila, así que `estaActivo($index, boton)` recibía el número de
botón como número de fila: **el simulador encendía la tecla equivocada**. Es el único error que
este componente no puede permitirse — el alumno aprende la digitación que le señalan. Se
corrigió con `let indiceFila = $index` y quedó una prueba que compara la lectura textual paso a
paso.

**Una guarda de rejillas que marcaba siete rejillas correctas.** `rejillas.spec.ts` borraba los
`minmax(...)` con una expresión que se para en el primer paréntesis de cierre; con
`minmax(min(240px, 100%), 1fr)` —el patrón responsive que pide el handoff— dejaba `OK, 1fr)` y
el `1fr` sobrevivía. El fallo era de la expresión regular. Se sustituyó por un recorrido que
respeta los paréntesis anidados.

**Un auditor de contraste sobre el DOM que no servía.** Recorrer los textos y componer el fondo
de sus ancestros falla en cuanto hay dos superficies translúcidas encima, que es justo lo normal
en el tema oscuro. Marcaba nueve textos correctos como fallidos. Se sustituyó por
`disenio/contraste.spec.ts`, que mide **pares de tokens** compuestos sobre su pila real: es
exacto, cubre las trece pantallas de una vez y falla sobre el valor que hay que cambiar.

**Tres valores del handoff no cumplían AA** y se corrigieron con el criterio del ADR 0009. Están
en la tabla del ADR 0012.

**El armazón dejó ciega a la prueba de enlaces rotos.** `RUTAS_INTERNAS` se derivaba de las rutas
de primer nivel; al colgar las trece pantallas de un padre de ruta vacía, dejó de verlas y la
prueba siguió en verde sin mirar nada. Ahora recorre las hijas.

---

## 4. Lo que NO funciona todavía, y se dice en la interfaz

Ninguna pantalla finge. Cada acción sin respaldo va **deshabilitada y con su explicación al
lado**, en vez de oculta o —peor— aparentando funcionar:

| Acción | Por qué no | Condición de salida |
|---|---|---|
| Reproducir vídeo | No hay proveedor de streaming (decisión pendiente 3) | El `<img>` pasa a `<video>` con HLS y URL firmada |
| Ir a pagar, comprar, cambiar de plan | El webhook es la única fuente de verdad del pago (no negociable 3) | Módulo `pagos` |
| Canjear un código de regalo | Escribe en `acceso_recurso`, y eso solo lo hace el backend (no negociable 2) | Módulo `acceso` |
| Descargar recursos y certificado en PDF | Los archivos no existen en almacenamiento | Fase 2 |
| Buscador, comentarios, reservar taller | No hay endpoint | Cuando exista |
| Guardar el perfil | No hay `PUT /yo` | Módulo `identidad` |

El reproductor lleva además un rótulo visible: «Vista previa · el vídeo aún no está conectado».

**Lo que sí funciona de verdad hoy:** el tema y su persistencia, el carrito completo (cantidades,
subtotal, envío gratis desde $300.000, persistencia), las preferencias de Ajustes, el simulador
sincronizado con el tiempo y con el BPM, los filtros de todas las pantallas, el flujo de regalo
con su vista previa en vivo, y el cambio de contraseña del perfil — que ya existía y sigue
hablando con `POST /api/acceso/contrasena`.

---

## 5. Verificación

```bash
cd frontend && npm test
```

302 pruebas en verde. Cobertura: **93,4 % de líneas, 93,3 % de sentencias, 86,6 % de funciones,
94,8 % de ramas** — por encima de los umbrales de la regla 10.

```bash
cd frontend && npm run lint && npx ng build
```

Sin errores ni avisos.

**No se pudo verificar visualmente en el navegador.** La vista previa de esta sesión fija el
origen y descarta la ruta, así que `/inicio` y las demás no se pueden abrir desde aquí. En su
lugar, `app.routes.spec.ts` navega de verdad a las trece rutas y comprueba que sale la pantalla
correcta dentro del armazón. **Queda pendiente una revisión visual con el propietario**, sobre
todo de la portada en tema oscuro, que es la variante que nadie diseñó.

---

## 5.1 Revisión del propietario sobre el panel de inicio (2026-08-16)

La revisión visual que quedaba pendiente se hizo sobre `/inicio` y produjo cuatro cambios. Tres
son de disposición; el cuarto es un fallo de contenido que la revisión destapó.

| Qué se pidió | Qué se hizo |
|---|---|
| La ruta del nivel y la clase en vivo, una al lado de la otra y **del mismo tamaño** | Dos columnas iguales (`repeat(2, minmax(0, 1fr))`) sin `align-items: start`, para que los dos paneles compartan alto. La acción del taller baja al fondo con `margin-top: auto` |
| Quitar «Tu suscripción» del panel | Fuera. El plan sigue en la barra lateral —que está en las trece pantallas— y en `/suscripcion` |
| Los tutoriales comprados, en tarjetas que se muevan de izquierda a derecha | El carrusel ya existía; le faltaba **cómo moverlo con un ratón de una sola rueda**. Se le añadieron dos flechas |
| El historial de compras | Sin cambios |

**El fallo que destapó la revisión.** El panel listaba `tutoriales()` completo bajo el título
«Tutoriales que compraste», y uno del catálogo tiene `comprado: false`: bajo ese título aparecía
una tarjeta con etiqueta «Nuevo» y su botón de **Comprar**. `/tutoriales` sí filtraba, con un
`computed` propio. El filtro se subió a `CatalogoServicio.tutorialesComprados()` y ahora las dos
pantallas preguntan lo mismo al mismo sitio — que es lo que evita que vuelva a divergir.

**Decisiones que valen para el próximo carrusel:**

- **Las flechas solo existen si hay desborde.** Dos botones apagados sobre una fila que no se
  puede mover no informan de nada. Con desborde aparecen las dos, y se apaga —no se esconde— la
  del extremo en el que ya está: una flecha que desaparece corre a la otra de sitio y el
  siguiente clic cae en el vacío.
- **La posición se LEE del DOM, no se lleva en un contador.** El desplazamiento también lo mueven
  el arrastre en móvil, la rueda y el teclado; un contador en la clase se desfasa con los tres.
  `medirCarrusel()` se dispara con el evento `scroll` y con el cambio de ancho de ventana.
- **El paso se mide, no se escribe.** Es el ancho real de la primera tarjeta más el `column-gap`
  calculado. Un número copiado a mano se desincroniza en el primer retoque del `.scss` y deja
  media tarjeta cortada.
- **La tarjeta crece pero no encoge** (`flex: 1 0 232px` con tope de 300 px): con una colección
  corta llena la fila en vez de dejar medio panel vacío, y cuando no cabe, la fila se desplaza en
  lugar de apretar seis tarjetas ilegibles.

**Datos simulados.** La colección tenía dos tutoriales comprados, que caben de sobra en la fila:
el carrusel no se podía enseñar moviéndose. Se añadieron tres comprados (`t7`, `t8`, `t9` — los
identificadores `t4` a `t6` ya los usaba `RECOMENDADOS`). Salen con el resto de datos simulados
el día que responda `GET /tutoriales`.

**Verificación.** Seis pruebas nuevas en `inicio.spec.ts` (310 en total, 93,2 % de líneas). En el
navegador, sobre el servidor de desarrollo: los dos paneles miden 478 × 307 px exactos, la fila
desborda (921 visibles de 1224) y las flechas se apagan en cada extremo. A menos de 1100 px las
columnas se apilan y no hay desborde horizontal.

---

## 5.2 Cambio de iconografía a Material Symbols (2026-08-16)

Segunda petición del propietario sobre las pantallas ya publicadas: **«iconos más profesionales
de Google y más grandes»**. Es exactamente lo que la regla 12 nombra en primer lugar —«la
biblioteca de Google u otra igual de profesional»— y lo que el [ADR 0005](../adr/0005-iconografia-phosphor.md)
había resuelto por la segunda mitad de la frase, porque el handoff ya venía con Phosphor.

La decisión y sus alternativas están en el [ADR 0014](../adr/0014-iconografia-material-symbols.md),
que **sustituye al 0005**. Aquí queda lo que costó y lo que enseñó.

**El cambio cabía en cinco archivos, y esa es la noticia.** El sistema tenía la indirección
correcta desde el principio: las plantillas escriben `<adr-icono nombre="caret-down">` y un
generador traduce ese nombre a un SVG. Cambiar la librería fue reescribir la traducción.

| Archivo | Qué cambió |
|---|---|
| `scripts/generar-iconos.mjs` | La lista de nombres pasó a ser un MAPA `nuestro → material` |
| `registro-iconos.ts` | Regenerado. 84 iconos → 64 |
| `icono.ts` | `viewBox` de `0 0 256 256` a `0 -960 960 960`; escala y defecto |
| `marcas.ts` | Entran WhatsApp y LinkedIn |
| 33 plantillas | Solo el número del tamaño |

**Se conservó el vocabulario del proyecto en vez de renombrar a los nombres de Google.**
`magnifying-glass` sigue diciéndose así aunque por dentro sea `search`. Renombrar habría tocado
cien plantillas para no ganar nada, y habría destruido justamente la indirección que hizo barato
este cambio. `<adr-icono nombre="...">` es API pública del catálogo; perseguir con ella el
nombre de una librería es acoplarse a lo que se acaba de demostrar que puede cambiar.

**La escala subió entera, no solo «los iconos».** De 16/20/24/32 a 20/24/32/40, con 24 por
defecto. No es capricho: el duotone de Phosphor llevaba una capa rellena al 20 % detrás del
trazo, y Material no la tiene. Al mismo número de píxeles pesa visualmente menos, así que
mantener la escala anterior habría entregado iconos **más pobres** que los de partida — lo
contrario de lo que se pidió.

**Dos cosas que Material no tiene, y por qué el hueco resultó ser útil:**

- **Logotipos de marcas.** Google los retiró de su catálogo, así que `whatsapp-logo` y
  `linkedin-logo` no tenían adónde ir. Pasaron a `marcas.ts` y se consumen con `<adr-marca>`,
  que es donde el [ADR 0010](../adr/0010-marcas-de-terceros-fuera-del-sistema-de-iconos.md)
  decía desde el principio que debían estar: una marca identifica a su dueño y lleva sus
  colores, no `currentColor`. **El cambio de librería solo adelantó una corrección pendiente.**
- El botón flotante de WhatsApp no necesitó una versión monocroma: el círculo verde del logotipo
  y el token `--adr-color-whatsapp` valen los dos `#25D366`, así que el círculo se funde con la
  pastilla y queda el auricular blanco — que es la forma que la marca aprueba sobre su verde.

**Y una sustitución que mejoró la interfaz.** El destello (`sparkle`) de «Consejo de Diego» no
existe en Material. Pasó a `lightbulb`: el destello era decoración, la bombilla dice que eso es
una idea útil.

**Se retiraron 18 iconos declarados y nunca usados**, y con ellos el paquete
`@phosphor-icons/core`. `strictTemplates` es lo que hizo esto seguro: `NombreIcono` es una unión
de literales, así que cualquier plantilla que citara un nombre retirado **no compila**. El
compilador encontró el único caso real —`item-nivel.ts`, que calculaba su tamaño con un ternario
fuera de la escala nueva—.

**Un efecto colateral que valía la pena.** Al añadir los tres tutoriales comprados (§5.1),
`catalogo-servicio.ts` pasó de 400 líneas y el linter lo paró. Los datos simulados se llevaron a
`catalogo-datos.ts`, y la separación resultó ser la correcta por sí misma: **el servicio es la
pieza que se queda** —su firma es el puerto que consumen las pantallas— y los datos son relleno
de prototipo que se borra entero el día que responda la API. Juntos, ese día habría que separar
a mano lo que se borra de lo que se conserva. El servicio quedó en 75 líneas.

**Verificación.** 311 pruebas en verde (una nueva en `marca.spec.ts` para los dos logotipos que
se mudaron), `ng build` y `npm run lint` sin avisos, y en el navegador: los 22 iconos de Ajustes
comparten el `viewBox` de Material y el menú de cuenta pasó de 20/16 px a 24/20 px.

---

## 6. Qué falta

- Revisión visual de las trece pantallas y de la portada oscura.
- Renombrar los alias de token heredados (`--adr-color-tinta` y compañía) a los nombres
  semánticos, en un cambio propio y aislado.
- El riel de iconos de 84 px para tablet: el handoff aprueba las dos formas y se eligió la barra
  inferior, que resuelve tablet y móvil con una sola pieza.
- Material real: fotos de producto, miniaturas por lección y pistas de digitación de verdad. Hoy
  hay una sola pista de ejemplo repetida en bucle.
