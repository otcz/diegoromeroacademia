# Correcciones de la landing — 2026-08-15

Registro de las dos rondas de auditoría multiagente sobre la landing pública y de lo que
se aplicó. Existe para que la siguiente sesión **no vuelva a proponer lo ya resuelto** ni
deshaga una decisión tomada con medidas.

Complementa a [`frontend-redisenio-landing.md`](frontend-redisenio-landing.md), que recoge el
diseño original. Donde este archivo contradiga a aquel, gana este: es posterior y está medido
sobre la página construida, no sobre el prototipo.

---

## 1. Los tres defectos que ninguna captura de pantalla mostraba

Los tres se descubrieron midiendo el DOM real, no mirando. Es el patrón que conviene repetir.

### 1.1 Los ocho botones no llevaban a ninguna parte

`/registro` nunca estuvo declarado en `app.routes.ts`. Lo capturaba el comodín `**`, que
entonces era `redirectTo: ''`, así que el visitante volvía a la portada **en silencio**. Un
enlace roto se veía exactamente igual que uno bueno.

Se corrigió en tres capas, para que no vuelva:

1. Un único `DESTINO_REGISTRO` en `app.routes.ts`, no ocho literales repartidos.
2. El comodín pasó a ser una pantalla 404 explícita. Un redirect silencioso es lo que dejó
   pasar el fallo durante semanas.
3. Una prueba que compara cada `href` interno de la landing contra `RUTAS_INTERNAS`,
   derivado de la propia tabla de rutas. **Encontró un octavo enlace roto mientras se
   escribía.**

`adr-boton` pasó a usar `routerLink` para destinos internos: con `href`, cada clic dentro de
la aplicación recargaba el paquete entero.

### 1.2 El héroe: tres capas de fondo que pintaban cero píxeles

`<adr-marco-imagen variante="fondo">` añadía su clase de marcador **aunque hubiera foto**, y
esa clase pinta un degradado de dos paradas 100% opacas en `position:absolute; inset:0`.
Tapaba por completo los degradados de la sección. `elementFromPoint` sobre el héroe devolvía
el marco.

Peor: el degradado del marcador estaba **invertido** respecto a la composición escrita — su
punto claro caía detrás del H1 y el oscuro detrás del panel de cristal.

**Corregido en la causa**, no en el síntoma: el marcador solo se pinta cuando `fuente()` es
`null`. No se puso `background: none` en `.adr-marco--fondo` porque esa variante la usan
también las tarjetas del catálogo, donde el degradado **es** el mecanismo que sustituye a la
foto ausente (ADR 0008).

> **Lección aplicable a todo el proyecto:** comprobar que el CSS *se aplica* no es comprobar
> que *se ve*. `getComputedStyle` decía que los degradados estaban puestos, y era cierto, y
> no se veía ninguno. La prueba buena es `elementFromPoint`.

### 1.3 Una imagen cambiada conservando el nombre

Al sustituir la foto del acordeón, el archivo mantuvo su ruta. Cloudflare siguió sirviendo la
anterior desde el borde: se midió `Content-Length: 219970` cuando la nueva pesaba 117.824.
El propietario recargaba y veía la página igual.

Y **la cabecera de origen no bastaba**: el proveedor la reescribía con su TTL de navegador
(`max-age=14400`, que nadie había puesto).

Lo único que manda en toda caché es un nombre distinto. Ahora las imágenes llevan huella de
contenido —`practica-botonadura.dedbd367.webp`— que genera `npm run imagenes:optimizar`, y una
prueba falla si alguna se declara sin ella o apunta a un archivo inexistente.

Aparte, `index.html` se servía **sin `Cache-Control`**. Sin esa cabecera el navegador inventa
su propia caducidad; y como el HTML es quien apunta a los `.js` con huella, una copia vieja
significa la aplicación vieja entera. Ahora va con `no-cache, must-revalidate`.

---

## 2. Lo que se quitó, y por qué quitarlo fue la mejora

| Qué | Por qué |
|---|---|
| Sección «La ruta» a tamaño completo | Su texto era **idéntico carácter a carácter** al del panel del héroe, a 1743 px de distancia en móvil. Casi dos pantallas para no aportar una palabra. El documento bajó de 8999 a 8159 px |
| Tercera tarjeta de precios («Curso suelto») | No es un plan: es el pago único del catálogo. Su botón empujaba *hacia arriba* en el momento de máxima intención de compra |
| Enlace «Ver todo →» del catálogo | Su destino apuntaba dentro de su propia sección: no movía nada al pulsarlo |
| Constante `CIERRE` | Exportada y muerta. Garantizaba que algún día alguien editara el texto equivocado |
| Una de las tres apariciones de «Cancela cuando quieras» | La del pie llegaba *después* de que la sección de acceso explicara que cancelar cuesta los cursos de la ruta |

---

## 3. Lo que se añadió

- **Sección «De cero a certificado»** (`seccion-camino`): el arco completo en 4 pasos. Cada
  pieza estaba explicada por separado, pero el recorrido entero no estaba escrito en ningún
  sitio — había que armarlo juntando cuatro secciones separadas por dos pantallazos. El paso 3
  lleva marca de repetición: sin ella el recorrido se lee como cuatro pasos y no como cuatro
  niveles, y el certificado del final pierde su peso.
- **Sección «Cómo funciona el acceso»** (`seccion-acceso`): la mitad dura de la
  especificación §3.2. La página decía tres veces «cancela cuando quieras» y **cero veces**
  que al cancelar se pierden los cursos de la ruta.
- **CTA «Empezar» en la barra de navegación**, fuera del menú colapsable. En móvil había
  4737 px —5,8 pantallas— entre el bloque del héroe y el siguiente botón visible.

---

## 4. Decisiones tomadas con criterio, que no conviene revertir

| Decisión | Criterio |
|---|---|
| «Un instructor» y no «Diego» revisa los exámenes | La especificación §4 define el actor como «Diego u otros profesores» y la decisión pendiente #4 sigue abierta. Comprometer a una persona obliga a retractarse en público cuando entre la segunda |
| «Ahorras más de dos meses» y no «dos meses gratis» | 12 × 39.900 − 349.900 = 128.900, que son 3,23 mensualidades. Se rechazó «casi cuatro meses gratis» por falsa en la dirección peligrosa, y las cifras exactas porque los precios son provisionales |
| Un certificado **por nivel**, no uno al final | La tabla `certificado` está claveada por `nivel_id` |
| «pierdes los cursos de la ruta», no «del catálogo» | Bajo la lectura natural, «el catálogo» es lo que acaba de estar rotulado CATÁLOGO — decía que cancelar te quita lo que compraste, justo lo contrario del no negociable 5 |
| Términos, Reembolsos, Verificar certificado y Crear cuenta van sin enlace | Sus rutas no existen. Existir es **requisito para cobrar el primer peso** |
| El relleno del CTA móvil se reduce, la altura **no** | Quedan ~92 px útiles entre la marca y la hamburguesa. `--adr-altura-control` (48 px) es el mínimo táctil de docs/04 §5: la restricción era el ancho, no el alto |

---

## 5. Guardas que quedan puestas

Cada una nació de un fallo real que llegó a producción.

| Prueba | Qué impide |
|---|---|
| `landing.spec.ts` — destinos internos contra `RUTAS_INTERNAS` | Que un CTA vuelva a apuntar a una ruta inexistente |
| `disenio/rejillas.spec.ts` | Un `fr` desnudo en cualquier rejilla. `1fr` es `minmax(auto, 1fr)`, y ese `auto` desbordaba la página 144 px a 768. **Encontró 13 casos, no los 5 enumerados** |
| `disenio/activos.spec.ts` | Una imagen sin huella de contenido, o que apunte a un archivo inexistente |
| `landing.spec.ts` — una sola `adr-ruta-niveles` | Que la ruta vuelva a dibujarse dos veces |
| `nav-publica.spec.ts` — CTA fuera del menú | Que la única acción de móvil vuelva a esconderse tras la hamburguesa |

`rejillas.spec.ts` merece una nota: la prueba **no puede medir maquetación**. Corre sobre
jsdom, que devuelve 0 en `scrollWidth`, `clientWidth` y `getBoundingClientRect`. Una
regresión escrita contra esas medidas pasaría en vacío para siempre. Por eso lee los `.scss`.

---

## 6. Segunda auditoría — acabado (2026-08-15)

Una segunda pasada de 61 agentes confirmó que **la estructura está terminada**: cero
desbordamiento en los cinco anchos, separación constante (112 px en móvil, 176 px desde
tableta), patrón de encabezado uniforme, y el orden verdad-antes-que-precio bien puesto —
«Si la cancelas, pierdes los cursos de la ruta» llega 700 px **antes** que las tarjetas de
precio. Eso no se tocó.

Lo que quedaba eran siete defectos de acabado:

| Defecto | Medida | Corrección |
|---|---|---|
| **«184 alumnos» y «281 alumnos»** | Los únicos datos sin procedencia. Su origen: el HTML de la maqueta. Falsos por construcción — sin backend no hay inscritos | `alumnos: null` |
| **22 pares de texto bajo WCAG AA** | 17 de `#6e7e92` (4,15:1) y 5 del azul rey como texto (4,44:1). `docs/04 §5` exige 4,5:1 | Dos tokens, no 22 sitios — [ADR 0009](../adr/0009-contraste-aa-de-las-tintas-de-texto.md) |
| **Dos H2 colgando 242 px del centro** | La regla de centrado existía y estaba **muerta**: ninguna plantilla llevaba la clase | Añadir la clase |
| **Favicon de Angular** | 15.086 bytes, sha256 idéntico al del andamiaje. Magenta `#ff31d9` y morado `#9f1aed` | Monograma generado desde el token |
| **Año del copyright horneado** | `getFullYear` no aparecía en ningún chunk servido | `new Date().getFullYear()` |
| **Campo muerto en el pie** | `urlVerificacion` ya no se usaba: arrastraba un import de entorno | Borrado. La clave se queda en `entornos/` |
| **`aria-label` sin rol** | Único componente del catálogo que incumplía la convención. Las cinco estrellas comparten trazado: el rótulo es el único portador de la cifra | `role="img"` |

Y una guarda nueva, [`plantillas.spec.ts`](../../frontend/src/app/plantillas.spec.ts): un acento
grave dentro de un comentario HTML **cierra el literal de plantilla** de TypeScript. Pasó
cuatro veces durante estas correcciones, siempre por querer citar con precisión, y los errores
que produce no señalan la causa —«Cannot find name 'none'»— y salpican a otros archivos.

---

## 7. Lo que sigue bloqueado

El backend **no expone ningún controlador**: `POST /api/acceso/sesion` devuelve 403 y en
`backend/src/main` no hay un solo `@RestController`. Hoy no se puede entrar ni registrarse.

La landing ya no promete lo que no existe, pero **ninguna mejora de esta página convierte una
visita en alumno** hasta que exista el módulo `identidad`. Es el siguiente trabajo real, y no
es trabajo de frontend.

---

## 8. La pantalla de acceso, 2026-08-15

Dos correcciones de fondo, una que no estaba en el código.

### El logotipo de Google no era de Google

El botón dibujaba la «G» de **Phosphor duotone**, teñida con `currentColor`. Un logotipo
aproximado en la pantalla que pide credenciales es la primera señal que enseña a desconfiar,
y además incumple la norma del proveedor. Resuelto separando **iconos** de **marcas** —
[ADR 0010](../adr/0010-marcas-de-terceros-fuera-del-sistema-de-iconos.md).

### El navegador estaba repintando la página

`getComputedStyle` daba `#f6f8fb` de fondo y `#16212e` de tinta; en la pantalla del
propietario salía azul noche con letra blanca. Era el **tema oscuro automático de Chrome**:
sin `color-scheme` declarado, invierte la paleta cuando el sistema está en oscuro.

Consecuencia real: **las medidas del ADR 0009 no valían para lo que él estaba viendo.** Se
declaró `color-scheme: only light`.

### La foto: del acordeón anónimo a Diego

Iba un Hohner Corona de banco al 28% de opacidad y con `mix-blend-mode: luminosity`, o sea
en gris. En una marca personal eso no distingue nada. Ahora va el afiche del propietario,
recortando la franja fotográfica y **dejando fuera todo el rotulado quemado** — un texto
dentro de una imagen no escala, no se selecciona y no lo lee un lector de pantalla.

### El contraste sobre foto se mide, no se estima

El texto se agrupó abajo y el velo se ancló **al bloque de texto**, no a un porcentaje del
panel. La primera versión repartía el degradado en porcentajes medidos a 900 px de alto: a
640 el bloque sube y el titular caía sobre la zona clara. Legible en la ventana donde se
midió y no en la de al lado.

Se midió componiendo foto y velo en un lienzo y recorriendo píxel a píxel la caja de cada
texto. Peor caso por elemento:

| Texto | Antes | Ahora | Mínimo |
|---|---|---|---|
| «Diego Romero» | 2,36:1 | 12,9:1 | 3:1 (texto grande) |
| «ACADEMIA» | — | 7,2:1 | 4,5:1 |
| Titular | 4,3:1 | 10,1:1 | 3:1 |
| Cifras | — | 17,3:1 | 3:1 |
| Rótulos y procedencia | — | 7,9:1 | 4,5:1 |
| Logotipo en celular | 3,5:1 | 10,7:1 | 3:1 |

Verificado a 375, 1280×640, 1440×900 y 1920×1080. Con el velo anclado al bloque, todo el
texto de la columna cae sobre noche azul **opaco**: el contraste deja de depender de la foto
y de la ventana. Lo garantiza `acceso.spec.ts`, que comprueba que ningún texto de marca
cuelgue fuera del bloque velado.
