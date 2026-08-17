# Academia Diego Romero — Paquete de diseño (web · tablet · móvil)

Plataforma de clases de acordeón vallenato de **Diego Romero (Estudio Académico DR)**: login, dashboard del estudiante, reproductor de clase con simulador de pisadas, zona de ejercicios, tutoriales, tienda con carrito, regalos, suscripción, perfil y ajustes.

## Cómo leer este paquete

Los archivos `.dc.html` de `screens/` son **referencias de diseño en HTML**: prototipos navegables que muestran el aspecto y el comportamiento buscados. **No son código de producción.** La tarea es **recrear estos diseños en el stack real** (React / Next.js recomendado) usando sus componentes, tokens y patrones. Si no existe stack, usar **React + TypeScript + Tailwind** (o CSS Modules) y montar la estructura descrita en "Arquitectura sugerida".

Abre los archivos en el navegador para explorarlos:

| Archivo | Qué contiene |
|---|---|
| `screens/dashboard-web-tablet-movil.dc.html` | **La app completa y responsive**: 11 vistas navegables, tema claro/oscuro, carrito, simulador. Es la fuente de verdad del comportamiento. |
| `screens/mockups-movil-tablet.dc.html` | Mockups estáticos en marcos de dispositivo: **8 pantallas móviles (390×844)** y **9 pantallas tablet (1112×834)**. Fuente de verdad de las adaptaciones. |
| `screens/login.dc.html` | Exploraciones del login; la versión aprobada es la marcada `5a` (y `6a/6b/6c` para móvil/tablet). |
| `assets/poster-clean.png` | Foto del artista, ya retocada (sin textos impresos). Único material fotográfico real. |
| `assets/logo-dr-4K.png` | Logo DR. **Sin transparencia**: usar recortado en círculo (`border-radius:50%`, fondo negro) o pedir versión SVG/PNG transparente. |

> Los archivos `support.js` e `image-slot.js` son del entorno de prototipado. **No se llevan a producción.**

## Fidelidad

**Alta fidelidad.** Colores, tipografía, espaciado, radios, sombras, estados y breakpoints están definidos abajo y son medibles en los prototipos (inspeccionar elemento). Reproducir fielmente; adaptar los nombres de tokens al sistema del proyecto si ya existe.

---

## Inventario de pantallas

| # | Pantalla | Ruta sugerida | Web (≥1024) | Tablet (768–1023) | Móvil (<768) |
|---|---|---|---|---|---|
| 1 | Login | `/acceso` | Split foto + formulario | Hero arriba + formulario centrado | Hero 330px + formulario |
| 2 | Inicio (dashboard) | `/inicio` | Sidebar + 3 bloques | Riel de iconos + 2 columnas | Barra inferior + 1 columna |
| 3 | Mis cursos | `/cursos` | 3 tarjetas por fila | 3 por fila | 1 por fila |
| 4 | Zona Ejercicios | `/ejercicios` | Reto + grid 4 | Grid 4 | Grid 1–2 |
| 5 | Ejercicio guiado | `/ejercicios/:id` | Video + BPM + pasos | Igual, 1 columna abajo | Video + franja simulador |
| 6 | Clase (reproductor) | `/clases/:id` | Video + panel derecho | Video + panel derecho estrecho | Video + tabs + comentarios |
| 7 | Tutoriales | `/tutoriales` | Colección + catálogo | Grid 4 | Grid 1 |
| 8 | Ver tutorial | `/tutoriales/:id` | Video + partes | Igual | Video + lista de partes |
| 9 | Tienda | `/tienda` | Grid + carrito lateral | Grid 3 + carrito | Grid 2 + hoja inferior |
| 10 | Regalar | `/regalar` | 3 pasos + preview | Igual, preview a la derecha | Pasos apilados + preview |
| 11 | Mi suscripción | `/suscripcion` | Estado + planes + pagos | Igual | Lista de planes |
| 12 | Mi perfil | `/perfil` | Form 2 columnas + lateral | 2 columnas | 1 columna |
| 13 | Ajustes | `/ajustes` | Notificaciones + lateral | 2 columnas | 1 columna |
| 14 | Certificado | `/certificados/:id` | Diploma + acciones | Igual | Diploma escalado |

Todas las pantallas existen en el prototipo responsive; el archivo de mockups muestra el detalle móvil (M1–M8) y tablet (T1–T9).

---

## Navegación

- **Web (≥1024px):** sidebar fijo de **246px** — Inicio · Mis cursos · Zona Ejercicios · Tutoriales · Tienda; abajo: bloque de plan (estado + "Gestionar suscripción"), Ajustes y Salir. Botón hamburguesa en la barra superior lo oculta/muestra (persistir la preferencia).
- **Tablet (768–1023px):** el sidebar se oculta; **riel de iconos de 84px** con etiqueta corta bajo cada icono, o la barra inferior si se prefiere una sola solución (el prototipo responsive usa barra inferior; los mockups de tablet muestran el riel — ambas aprobadas, elegir una).
- **Móvil (<768px):** **barra inferior fija** de 5 pestañas — Inicio, Cursos, Ejercicios, Tienda, Cuenta — con indicador superior de 3px en la activa. `padding-bottom: 76px` en el contenido.
- **Barra superior (todas):** hamburguesa · buscador (máx. 360px) · engranaje de Configuración · carrito (icono con burbuja de conteo) · tema claro/oscuro · notificaciones · usuario (nombre + avatar → menú). En <620px se oculta el nombre y quedan los iconos.
- **Menú de usuario:** Gestionar mi suscripción · Regalar clases o productos · Mi perfil · Ajustes · Cerrar sesión.

---

## Design tokens

Ambos temas se resuelven con **variables CSS** sobre un atributo `data-theme` en el contenedor raíz (`dark` por defecto, `light` alternativo). Copiar esta tabla al sistema de tokens del proyecto.

| Token | Oscuro | Claro | Uso |
|---|---|---|---|
| `bg` | `#080614` | `#f5f6fb` | Fondo de la app |
| `sidebar` | `linear-gradient(180deg,#0a0818,#090a1c)` | `linear-gradient(180deg,#fff,#f8f9fe)` | Sidebar / riel |
| `main` | `radial-gradient(900px 620px at 82% -8%,rgba(30,90,220,.2),transparent 62%), linear-gradient(170deg,#080614,#0a0f2c)` | `radial-gradient(… rgba(47,102,245,.1) …), linear-gradient(170deg,#f8f9fe,#eef1fb)` | Área de contenido |
| `header` | `rgba(8,6,20,.72)` + blur 14 | `rgba(255,255,255,.88)` + blur 14 | Barra superior sticky |
| `card` / `card2` | `rgba(255,255,255,.04)` / `.03` | `#ffffff` / `#fafbff` | Superficies |
| `card-shadow` | ninguna | `0 1px 3px rgba(16,24,64,.05)` | Elevación en claro |
| `border` | `rgba(255,255,255,.09)` (y .08/.12/.14/.16/.18) | `#e4e7f2` (`#e8eaf4`/`#e2e5f1`/`#dfe3ef`/`#d9dded`/`#d3d8ea`) | Bordes por jerarquía |
| `text-1…4` | `#fff` · `rgba(255,255,255,.85)` · `.72` · `.6` | `#0e1230` · `#2c3157` · `#3a4066` · `#5b6180` | Títulos → cuerpo |
| `text-muted` | `rgba(255,255,255,.55–.4)` | `#6b7194`–`#9297b2` | Metadatos |
| `brand-grad` | `linear-gradient(120deg,#1273d4,#2f66f5)` | igual | CTA principal |
| `brand-shadow` | `0 8px 18px rgba(18,115,212,.3)` | igual | Sombra de CTA |
| `link` | `#7fa9ff` (hover `#a9c4ff`) | `#1d4fd7` (hover `#12379f`) | Enlaces |
| `blue-soft` | `rgba(47,102,245,.10–.34)` | `rgba(47,102,245,.07–.20)` | Chips/pills activos |
| `success` | texto `#6ee7b7`, icono `#34d399`, fondo `rgba(52,211,153,.08–.2)` | `#0b8f5a`, fondo `rgba(16,185,129,.07–.16)` | Activa / completado / pagado |
| `warning-gold` | texto `#f4c37a`, icono `#f0a83c`, fondo `rgba(240,168,60,.14–.28)` | `#96600f`, icono `#c98a1e` | Regalos, certificados, "en camino" |
| `danger` | `#fca5a5` / borde `rgba(248,113,113,.34)` | `#c23a3a` / `rgba(220,38,38,.28)` | Suscripción vencida, errores |
| `purple` | `#b593ff` | `#6d3fd4` | Métrica de práctica |
| `focus` | `#2f66f5` + `0 0 0 4px rgba(47,102,245,.16)` | igual | Foco de inputs |

**Estado de la suscripción** (línea lateral de 4px + chip): Activa → verde `#10b981`; Vence pronto → azul `#2f66f5`; Vencida → rojo `#dc2626`.

**Tipografía — Archivo** (Google Fonts, 400/500/600/700 + 900 itálica):
`display` italic 900 19–52px uppercase (titulares de marca, certificado) · `h1` 700 22–27px/1.2 · `h2` 700 15–18px · `body` 400 12.5–14px/1.5 · `label` 600 11.5–13px · `kicker` 600 9–10.5px con `letter-spacing .12–.18em` · `mono-ish` números 700.

**Espaciado** (escala 4): 3 · 5 · 7 · 9 · 11 · 14 · 16 · 18 · 20 · 22 · 24 · 34 px. Gaps de tarjetas 16–18px; padding de tarjeta 18–22px; padding de contenido 22–34px (16–18px en móvil).

**Radios:** 9–11 (botones/chips pequeños) · 12–14 (inputs, botones grandes) · 16–18 (tarjetas) · 26–44 (marcos de dispositivo) · 999 (pills) · 50% (avatares).

**Alturas de control:** input/botón 40–44px web · 48–52px táctil; CTA 46–52px; nunca menos de 44px en móvil. Iconos 13–20px, trazo 1.8–2.

---

## Componentes a construir

**Layout:** `AppShell` (sidebar + header + main + bottom-nav) · `Sidebar` · `IconRail` (tablet) · `BottomNav` · `TopBar` · `UserMenu` · `ThemeToggle` · `CartDrawer` (panel lateral 384px con overlay).

**Contenido:** `ContinueCard` (hero de "continuar donde quedaste") · `StatTile` · `RouteItem` (módulo completado/en curso/bloqueado) · `SubscriptionCard` (con estado) · `LiveClassCard` · `TutorialCard` · `CourseCard` · `ExerciseCard` · `ProductCard` (con acción "Regalar") · `CartLine` · `OrdersTable` · `PaymentsTable` · `PlanCard` · `GiftCardPreview` · `CertificateSheet` · `PrefToggle` · `Chip` / `SegmentedControl` · `EmptyState`.

**Reproductor (`LessonPlayer`):** contenedor 16:9 fluido (`aspect-ratio:16/9`, `max-height:min(62vh,540px)`; en pantalla completa `min(80vh,760px)`), overlay de gradientes, botón central play/pausa 64px, barra de progreso, controles: play · −15 · +15 · volumen · **velocidad** (0.5× · 0.75× · 1× · 1.25× · 1.5× · 2×) · CC · **Simulador** · pantalla completa. Debajo: tabs **Comentarios / Resumen / Recursos**; a la derecha: progreso del curso + lista de clases; al final: recursos de la clase.

**`FingeringSimulator` (simulador de pisadas)** — el componente más específico del producto:
- Modelo: acordeón vallenato de 31 botones. **Pitos a la izquierda** en 3 filas (F1 = 10, F2 = 11, F3 = 10) y **bajos a la derecha** (12 en 2 columnas de 6). Columnas escalonadas media tecla (`margin-top: 8px` en F1/F3 y en la 2.ª columna de bajos) para imitar la diagonal real.
- Estado por paso: `{ fila, botón, dirección: 'abriendo'|'cerrando', bajo: 'Sol'|'Do'|'Re' }`. Lectura textual siempre visible: "Fila 2 · botón 5 — Bajo Sol · abriendo · 1x".
- Tecla activa: 13px, `box-sizing:border-box`, gradiente `linear-gradient(140deg,#3b82f6,#7b3ff2)` + halo `0 0 0 3px rgba(47,102,245,.32)`; bajo activo en dorado `#f0a83c→#e07b1f`. Inactivas `rgba(255,255,255,.08)` con borde `.18`.
- **Sincronía:** avanza con el tiempo del video multiplicado por la velocidad (en el prototipo, ~1.5 pasos/seg a 1×). En el ejercicio guiado se sincroniza con el **BPM** (50–180, paso 5).
- **Dos disposiciones:** vertical (panel de 236px sobre el video, ≥1460px de ancho y ≥760px de alto) y **franja horizontal** (filas horizontales, resto de casos y móvil). Se puede ocultar/mostrar desde el panel y desde la barra de controles, también en pantalla completa.
- En producción: alimentar los pasos desde una pista de datos por lección (`[{t, fila, boton, dir, bajo}]`), idealmente generada por el profesor.

---

## Comportamientos e interacciones

- **Tema:** claro/oscuro con persistencia (`localStorage`), aplicado por `data-theme` en el raíz. Respetar `prefers-color-scheme` en la primera visita.
- **Carrito:** añadir desde la tarjeta (el botón pasa a "En el carrito · n"), cantidades ±, vaciar, subtotal, **envío gratis desde $300.000** (si no, $18.000), total y "Ir a pagar". Contador en el icono de la barra superior. Persistir carrito.
- **Tienda:** filtros por categoría (Todo · Acordeones · Accesorios · Material PDF · Merch). Cada producto tiene acción de regalo.
- **Regalar:** 3 pasos — (1) tipo: Suscripción (1/3/6/12 meses), Bono ($50/100/200 mil) o Producto; (2) destinatario: nombre, correo/WhatsApp, mensaje (máx. 200), entrega (ahora / fecha / la entrego yo); (3) pago (tarjeta, PSE, Nequi). **Vista previa de la tarjeta en vivo** mientras se escribe. Canje por código para quien recibe. La suscripción de regalo **no se renueva automáticamente**.
- **Suscripción:** estado con color, próximo cobro y días restantes, medio de pago, "Pagar ahora" / "Cambiar medio de pago" / "Cancelar renovación"; cambio de plan con interruptor **Mensual/Anual** (anual = 10 meses) que recalcula precios; historial de pagos con facturas.
- **Ejercicios:** reto semanal con progreso, filtros por tipo, bucle A–B, control de BPM, repeticiones del día y pasos marcables.
- **Certificado:** vista de diploma (papel claro con doble borde dorado `#d8b06a`) + Descargar PDF · Compartir en LinkedIn · Copiar enlace de verificación; código verificable.
- **Ajustes:** notificaciones (5 interruptores), idioma (Español/English/Português), zona horaria, subtítulos, reproducción (autoplay, simulador por defecto, calidad), tema.
- **Perfil:** foto, datos, nivel, seguridad (contraseña, verificación en dos pasos).

## Breakpoints (comportamiento verificado en el prototipo)

| Rango | Qué cambia |
|---|---|
| ≥1460px y alto ≥760px | Sidebar + simulador **vertical** |
| 1024–1459px | Sidebar + simulador en **franja horizontal** |
| <1024px | Sidebar oculto → **barra inferior**; `main` con `padding-bottom:76px` |
| <860px | Se liberan todos los `min-width`: columnas del reproductor, tienda, perfil y regalos se apilan; tablas a 2 columnas |
| <620px | Cabecera y márgenes compactos; se oculta el nombre junto al avatar |

Reglas transversales: rejillas con `repeat(auto-fit,minmax(190–260px,1fr))`; filas de tarjetas con `flex-wrap` y `flex: N 1 <base>`; chips con `white-space:nowrap`; video con `aspect-ratio` (nunca alto fijo).

## Estado y datos

```
sesión:        { usuario, plan, estadoPlan: 'activa'|'porVencer'|'vencida' }
tema:          'dark' | 'light'                (persistido)
navegación:    { ruta, sidebarVisible }
reproductor:   { playing, t, velocidadIdx, simuladorVisible, pantallaCompleta, tab }
ejercicio:     { bpm, repeticiones, pasoActual }
carrito:       { [productoId]: cantidad }      (persistido)
regalo:        { tipo, opción, destinatario, mensaje, entrega }
preferencias:  { notificaciones{5}, idioma, zona, reproducción{3} }
```

Endpoints esperados (nombres sugeridos): `GET /me`, `GET /courses`, `GET /lessons/:id` (incluye `fingering[]`), `POST /lessons/:id/progress`, `GET /exercises`, `GET /tutorials`, `GET /products`, `POST /cart`, `POST /orders`, `POST /gifts`, `POST /gifts/redeem`, `GET /subscription`, `POST /subscription/change`, `GET /invoices`, `GET /certificates/:id`.

## Arquitectura sugerida

```
src/
  app/(auth)/acceso            login
  app/(app)/inicio             dashboard
  app/(app)/cursos             lista + detalle
  app/(app)/clases/[id]        reproductor + simulador
  app/(app)/ejercicios         zona + ejercicio guiado
  app/(app)/tutoriales         lista + detalle
  app/(app)/tienda             catálogo + carrito
  app/(app)/regalar            flujo de regalo
  app/(app)/suscripcion        plan y pagos
  app/(app)/perfil, /ajustes, /certificados/[id]
  components/layout            AppShell, Sidebar, TopBar, BottomNav, UserMenu
  components/player            LessonPlayer, FingeringSimulator, Controls, CommentList
  components/commerce          ProductCard, CartDrawer, GiftFlow, PlanCard
  components/ui                Chip, Toggle, Card, Badge, EmptyState, Progress
  styles/tokens.css            variables de tema (tabla de tokens)
```

**Orden de implementación:** (1) tokens + tema + `AppShell` responsive; (2) Inicio; (3) reproductor + simulador (el riesgo técnico está aquí); (4) cursos/ejercicios/tutoriales; (5) tienda + carrito + regalos; (6) suscripción/perfil/ajustes/certificado.

## Pendientes de material real

- Fotos de producto de la tienda (en los prototipos son zonas para soltar imágenes).
- Logo con fondo transparente (SVG preferible).
- Miniaturas reales por lección/tutorial (hoy se reutiliza la foto del artista).
- Pistas de digitación (`fingering[]`) por lección para el simulador.
- Textos legales, precios y política de renovación definitivos.
