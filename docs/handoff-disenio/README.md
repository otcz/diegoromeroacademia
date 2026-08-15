# Handoff: Academia Diego Romero — Sistema visual y flujo del estudiante

## Overview
Plataforma web de formación musical (vallenato) sobre la marca personal de Diego Romero (`@DiegoRomeroAcordeon`, 26.000 suscriptores). Modelo: suscripción a cursos por niveles + venta suelta de tutoriales + tienda. Diferenciador: simulador de pisadas de botones sincronizado con video. Lanzamiento fase 1 **solo con acordeón**; luego caja/guacharaca y guitarra.

Este paquete documenta el **sistema visual aprobado («Azul rey»)**, la **landing pública diseñada en alta fidelidad** y el **inventario completo de pantallas** que faltan por construir. La especificación funcional completa (modelo de datos, reglas de negocio, fases) está en `documento-maestro-especificacion.md` — es la fuente de verdad funcional y este README no la reemplaza.

## About the Design Files
Los archivos `.dc.html` de esta carpeta son **referencias de diseño creadas en HTML** — prototipos que muestran el aspecto y comportamiento previstos, NO código de producción para copiar. La tarea es **recrear estos diseños en el entorno del proyecto**: según la especificación, frontend **Angular 18** con backend Java 21 + Spring Boot 3 (§16 del documento maestro). Usar los patrones y librerías de ese stack; si el repositorio aún no existe, iniciar con ese stack.

Para verlos renderizados: abrir los archivos desde la raíz del proyecto de diseño (dependen de `support.js` e `image-slot.js` como hermanos; `Identidad y Flujo.dc.html` además referencia `_ds/…`, solo presente en el proyecto original).

## Fidelity
- **`Landing Azul.dc.html` — ALTA fidelidad (hifi), diseño APROBADO.** Colores, tipografía, espaciado, copy e interacciones son finales. Recrear píxel a píxel.
- **`Identidad y Flujo.dc.html` — tableros de referencia.** El tablero «2b Azul rey» (turno 2) define los tokens vigentes y muestras de componentes (hifi). El tablero 2a «Ámbar» y el turno 1 (estilo editorial Broadsheet) son direcciones **descartadas** — conservadas solo como historial; no implementar.
- El diagrama de flujo y la tabla de 17 pantallas (turno 1, parte inferior) siguen vigentes como mapa funcional.

## Sistema visual aprobado: «Azul rey» (2b)

### Tipografía (Google Fonts)
- **Titulares:** Bricolage Grotesque — 800 para display, 700 para títulos de tarjeta/sección. Letter-spacing -0.015em a -0.02em. Line-height 1.02–1.2.
- **Cuerpo/UI:** Instrument Sans — 400 cuerpo, 500 nav, 600 botones/etiquetas/kickers.
- Escala usada: display 64px (héroe), 40–42px (títulos de sección), 30–36px (cifras/precios), 20px (título de tarjeta), 15–18px cuerpo, 11–13px caption en MAYÚSCULAS con letter-spacing 0.1–0.16em.
- Gesto de marca: **subrayado mango** en la palabra clave del titular — `background: linear-gradient(180deg, transparent 76%, rgba(255,176,31,0.95) 76%)` sobre un `<span>`.

### Colores
| Token | Hex | Uso |
|---|---|---|
| Niebla | #F6F8FB | Fondo de página |
| Blanco | #FFFFFF | Tarjetas |
| Tinta | #16212E | Texto principal, botón outline |
| Azul rey | #1D6BF3 | ÚNICA tinta de acción: botones primarios, marca, kickers |
| Azul profundo | #1552C4 | Hover del azul, enlaces de texto |
| Noche azul | #0E1B2E | Héroe, sección simulador, footer |
| Mango | #FFB01F | Solo chispa: subrayados, estrellas de dificultad, tag «Nuevo», tag «Recomendado». NUNCA en botones |
| Éxito | #1F9D66 | Barras de progreso, aprobado |
| WhatsApp | #25D366 | Solo el botón flotante (hover #1DA851) |
| Texto secundario | #4A5A6E | Párrafos sobre claro |
| Texto atenuado | #6E7E92 | Captions, metadatos |
| Bordes | #DCE3EC (divisores), #C0CBD9 (outline suave) | |
| Tintes de etiqueta | Azul #E3EDFE/#134BB8 · Mango #FFF3D6/#8a5f04 · Verde #DFF0E8/#17603F · Pista de barra #E4EAF2 | fondo/texto |
| Sobre oscuro | texto rgba(255,255,255,0.85/0.65/0.6), bordes rgba(255,255,255,0.12–0.4) | |

### Reglas de color
1. El azul rey es la única tinta de acción — si algo se puede clicar, es azul.
2. El mango nunca va en botones; solo acentos pequeños.
3. El verde solo comunica progreso/aprobación.
4. Secciones alternan Niebla y Noche azul para dar ritmo (héroe y simulador y footer oscuros, resto claro).

### Forma, sombra, espaciado
- Radios: 16px tarjetas y marcos, 14px tarjeta de curso, 999px (pill) todos los botones y etiquetas.
- Sombras: tarjetas `0 2px 12px rgba(14,27,46,0.06–0.08)`; plan destacado `0 8px 28px rgba(29,107,243,0.18)` + borde 2px azul; flotante `0 6px 20px rgba(14,27,46,0.25)`.
- Botones: alto ≈48px (padding 13–15px vertical, 24–30px horizontal), texto 15–16px/600. Primario azul→hover azul profundo; secundario outline 1.5px Tinta→hover fondo Tinta texto blanco; sobre oscuro outline blanco 40%→hover 100%.
- Contenedor: max-width 1200px, padding lateral 48px, secciones separadas ~88px.
- **Mobile first:** una columna en celular, menú colapsable, botones táctiles ≥48px, WhatsApp flotante siempre visible.
- Iconos: **Phosphor duotone** (SVG inline, `currentColor`). Sin emojis.

## Screens / Views

### 1. Landing pública `/` — DISEÑADA (Landing Azul.dc.html)
Secciones en orden:
1. **Nav:** wordmark «Diego Romero» (Bricolage 800, 22px) + «ACADEMIA» (11px caps) | enlaces Cursos·Simulador·Planes (15px/500) | «Entrar» outline + «Registrarme» azul.
2. **Héroe (Noche azul):** foto full-bleed con velo `linear-gradient(100deg, rgba(10,19,33,0.88) 30%, …0.45 65%, …0.1 100%)`; kicker mango caps; H1 64px blanco con «desde cero.» subrayado mango; sub 18px rgba(blanco,0.85); CTA «Empezar ahora» + enlace «Ver planes y precios →»; nota «Precios visibles, sin registrarte · Cancela cuando quieras». Padding 104px/96px.
3. **Cifras:** 4 columnas (26.000 suscriptores · 362 videos · 4 niveles · 100% exámenes revisados), número Bricolage 30px + caption caps; borde inferior #DCE3EC.
4. **El método:** kicker azul, H2 40px «Como una academia de verdad, no una lista de videos»; 3 tarjetas blancas con numeral azul 40px: Niveles que se desbloquean / Exámenes con revisión personal / Certificado verificable.
5. **Simulador (Noche azul, full-width):** captura en marco claro #E4EAF2 radius 16 (izq.) + kicker mango «Solo aquí», H2 blanco, párrafo, 3 checks (✓ BPM ajustable, loop A–B, afinaciones FBE/GCF).
6. **Catálogo:** H2 + enlace «Ver todo el catálogo →»; 3 tarjetas con foto 170px: (a) Curso completo — «Incluido en el plan», CTA azul full-width; (b) La gota fría — tag «Nuevo» mango sobre la foto, «Dificultad ★★★☆☆ · 184 alumnos», precio $34.900 Bricolage 22px + «Comprar» outline; (c) Los caminos de la vida — ★★☆☆☆ · 281 alumnos, igual. Nota: «Compraste un tutorial: es tuyo para siempre…».
7. **Planes:** 3 tarjetas — Mensual $39.900/mes (outline) · **Anual $349.900/año destacado** (borde azul 2px, sombra azul, tag mango «Recomendado» flotando -13px, CTA azul) · Curso suelto desde $34.900. Nota de precios provisionales (toggleable).
8. **Testimonio:** cita Bricolage 700 26px + atribución caps.
9. **Footer (Noche azul):** H2 42px con subrayado mango; CTAs «Registrarme gratis» + «Hablar por WhatsApp» outline; columna de enlaces (Términos, Reembolsos, Verificar certificado, redes); línea de copyright sobre borde rgba(blanco,0.12).
10. **Flotante WhatsApp** verde, fijo abajo-derecha, con icono Phosphor y mensaje precargado (nombre + instrumento).

### 2–17. Pendientes de diseño (construir con estos mismos tokens)
Del documento maestro §6.1 (rutas y contenido exactos allí):

| # | Pantalla | Ruta | Fase |
|---|---|---|---|
| 2 | Landing por instrumento (SEO) | /como-tocar-acordeon-vallenato | 1 |
| 3 | Acceso (Google · Facebook · correo, unificación de cuentas) | /login | 1 |
| 4 | Bienvenida / onboarding (instrumento + nivel) | /bienvenida | 1 |
| 5 | Planes | /planes | 1 |
| 6 | Confirmación de pago | /pago/confirmado | 1 |
| 7 | Mis cursos (tarjetas con progreso por curso) | /mis-cursos | 1 |
| 8 | Ruta de niveles (completado/actual/bloqueado 🔒) | /curso/{slug} | 1 |
| 9 | Reproductor (video protegido, lista lateral, marca de agua) | /clase/{id} | 1 |
| 17 | Perfil (datos, pagos, suscripción, dispositivos) | /perfil | 1 |
| 10 | Examen (teoría 40% + video práctico 60%) | /nivel/{id}/examen | 2 |
| 13 | Certificados (PDF + verificación pública /verificar/{código}) | /certificados | 2 |
| 11 | Práctica (catálogo de ejercicios) | /practica | 3 |
| 12 | Simulador de pisadas (diagrama + BPM + loop A–B) | /practica/{ejercicio} | 3 |
| 14 | Tienda (digital + físico) | /tienda | 4 |
| 15 | Carrito (valida stock antes de cobrar) | /carrito | 4 |
| 16 | Mis compras (digitales + estado de envío) | /mis-compras | 4 |
| — | Panel de administración (§13: tablero, catálogo, exámenes, tienda, editor de secuencias) | /admin | 1–4 |

**Flujo:** Landing/YouTube/WhatsApp → registro → onboarding → plan+pago → Mis cursos → niveles → clases → examen → certificado; ramas: Práctica→Simulador, Tienda→Carrito→Mis compras.

## Interactions & Behavior
- Nav ancla a #cursos/#simulador/#planes; en producción, rutas reales.
- Hovers definidos arriba (azul→azul profundo; outline→relleno tinta). Focus visible: anillo 2px azul rey con offset.
- WhatsApp flotante abre `api.whatsapp.com/send` con texto precargado.
- Barras de progreso: pista #E4EAF2, relleno verde, radius 999.
- Estados clave a diseñar en las pantallas internas: nivel bloqueado (candado Phosphor + tag outline), clase vista (check verde), examen `pendiente/en_revision/aprobado/rechazado`.
- Responsive: <768px una columna; grids de 3 y 4 colapsan; nav colapsable.

## State Management
Ver documento maestro §15 (modelo de datos completo). Claves para el front: `acceso_recurso` decide qué se ve (suscripción = temporal, compra = permanente); progreso **por inscripción** (curso), no por usuario; desbloqueo de nivel validado en backend; «continuar donde quedaste» desde `avance_clase.segundo_ultimo`.

## Assets
- Fotos: los `<image-slot>` son placeholders — hacen falta fotos reales de Diego (héroe 4:5 y apaisada), capturas del simulador y fotos por curso. Sin fotos definitivas, usar los slots o imágenes temporales, nunca ilustraciones genéricas.
- Iconos: Phosphor (https://phosphoricons.com), peso duotone, SVG inline.
- Logo: wordmark tipográfico «Diego Romero / ACADEMIA» (no hay logo gráfico aún; pendiente de marca en la SIC, §2).
- `image-slot.js` y `support.js` son runtime del prototipo, no assets de producción.

## Files
- `Landing Azul.dc.html` — landing hifi APROBADA (sistema Azul rey).
- `Identidad y Flujo.dc.html` — tableros: sistema 2b vigente + 2a/turno-1 descartados + flujo y tabla de 17 pantallas.
- `documento-maestro-especificacion.md` — especificación funcional completa v1.0 (fuente de verdad).
- `image-slot.js`, `support.js` — runtime de los prototipos.
- En el proyecto original además: `Landing.dc.html` (v1 ámbar/editorial, descartada).
