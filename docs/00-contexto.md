# 00 · Documento de contexto

**Estado:** vigente · **Última actualización:** 14 de agosto de 2026

Este documento responde a la pregunta «¿en qué punto está el proyecto y por qué está así?».
Se actualiza cada vez que se cierra una decisión o se termina un entregable. No repite la
especificación funcional: eso vive en `docs/especificacion-maestra.md`.

---

## 1. Qué es el proyecto

Plataforma web de formación musical en línea para el mercado hispanohablante, construida sobre
la marca personal de Diego Romero (26.000 suscriptores en YouTube, `@DiegoRomeroAcordeon`).

Combina dos modelos que hoy están separados en el mercado:

- Suscripción a cursos estructurados por niveles.
- Venta suelta de tutoriales, instrumentos y accesorios.

**Diferenciador competitivo:** el simulador de pisadas de botones sincronizado con video.
Ningún competidor analizado lo tiene.

**Fase 1 sale solo con acordeón.** El activo hoy es «el que enseña acordeón vallenato».
Diluirse antes de consolidar es el riesgo más grande del proyecto.

---

## 2. Personas

| Rol | Quién | Responsabilidad |
|---|---|---|
| Propietario de marca | Diego Romero | Contenido, precios, revisión de exámenes prácticos |
| Desarrollo y arquitectura | Oscar Tomás Carrillo Zuleta | Todo lo técnico |

---

## 3. Lenguaje ubicuo

Los nombres del código son los mismos del negocio. Esta tabla es la referencia obligatoria:
si un concepto está aquí, se llama así en la base de datos, en las clases Java, en el JSON
de la API y en el frontend. Sin sinónimos.

| Término | Significado exacto | Cuidado con |
|---|---|---|
| `Usuario` | Persona registrada, con cualquier rol | No usar «cliente», «alumno» ni «estudiante» en el código |
| `Estudiante` | Rol de un `Usuario`, no una entidad aparte | No crear tabla `estudiante` |
| `IdentidadExterna` | Vínculo de un proveedor OAuth con un `Usuario` | Varias por usuario, un solo usuario por correo |
| `Plan` | Producto de suscripción (mensual / anual) | No confundir con `Producto` de tienda |
| `Suscripcion` | Contrato vigente de un usuario con un plan | Tiene estado y vencimiento |
| `AccesoRecurso` | **Único** registro de qué puede ver un usuario | `vence_en` nulo = permanente |
| `Instrumento` | Acordeón, caja, guacharaca, guitarra | Existe desde el día uno aunque solo salga acordeón |
| `Curso` | Programa completo de un instrumento | Tiene `slug` para SEO |
| `Nivel` | Etapa secuencial y bloqueante dentro de un curso | El desbloqueo se valida en backend |
| `Modulo` | Bloque temático dentro de un nivel | Navegación libre dentro del nivel |
| `Clase` | Unidad de video | |
| `Recurso` | Adjunto de una clase (partitura, pista, PDF) | Distinto de `AccesoRecurso` |
| `Inscripcion` | Relación usuario–curso que **lleva el progreso** | El progreso es por inscripción, nunca por usuario |
| `AvanceClase` | Marca de clase vista y último segundo reproducido | Alimenta «continuar donde quedaste» |
| `IntentoExamen` | Envío de un examen: teoría automática + video práctico | Estados: `pendiente`, `en_revision`, `aprobado`, `rechazado` |
| `Certificado` | PDF emitido con código único verificable | No se pierde al vencer la suscripción |
| `Ejercicio` | Pieza practicable en el simulador | Tiene `bpm_original` y `afinacion` |
| `SecuenciaPisada` | Evento con marca de tiempo: qué botones y en qué dirección va el fuelle | La dirección del fuelle es obligatoria |
| `Producto` | Artículo de tienda, `digital` o `fisico` | Comportamientos distintos, misma tienda |
| `Pedido` | Compra en tienda, con estado logístico | `preparando`, `enviado`, `entregado` |
| `Pago` | Transacción con la pasarela | El webhook es la fuente de verdad |

**Términos prohibidos en el código:** `data`, `info`, `manager`, `helper`, `util`, `procesar`,
`hacer`, `temp`, `aux`, `objeto`, `item` (salvo en iteradores locales muy cortos).

---

## 4. Decisiones ya cerradas

| # | Decisión | Fecha | ADR |
|---|---|---|---|
| 1 | Java 21 + Spring Boot + Maven + PostgreSQL + Angular | 2026-08-14 | [0001](adr/0001-stack-tecnologico.md) |
| 1b | Versiones vigentes: Spring Boot 4.1 y Angular 21 (las de la especificación están sin soporte) | 2026-08-14 | [0006](adr/0006-versiones-vigentes-framework.md) |
| 2 | Nomenclatura en español, sin tildes ni ñ | 2026-08-14 | [0002](adr/0002-idioma-de-nomenclatura.md) |
| 3 | Monolito modular con arquitectura hexagonal | 2026-08-14 | [0003](adr/0003-arquitectura-hexagonal-modular.md) |
| 4 | Monorepo con `backend/`, `frontend/` y `docs/` | 2026-08-14 | [0004](adr/0004-monorepo.md) |
| 5 | ~~Iconografía Phosphor duotone~~ — sustituido | 2026-08-14 | [0005](adr/0005-iconografia-phosphor.md) |
| 5b | **Iconografía Material Symbols Rounded**, escala 20/24/32/40 | 2026-08-16 | [0014](adr/0014-iconografia-material-symbols.md) |
| 6 | Sistema visual «Azul rey» aprobado | 2026-08-14 | Handoff de diseño |
| 6b | Doble tema claro/oscuro en todo el sitio, sobre capa semántica de tokens | 2026-08-16 | [0012](adr/0012-doble-tema-en-todo-el-sitio.md) |
| 6c | Rutas de la aplicación del estudiante: manda la especificación, armazón en ruta padre | 2026-08-16 | [0013](adr/0013-rutas-de-la-aplicacion-del-estudiante.md) |
| 7 | Marca personal en vez de marca institucional | 2026-08-09 | Especificación §2.1 |
| 7b | **`diegoromeroacademia.com` es el dominio del proyecto** | 2026-08-15 | Decisión de Diego + Tomás |
| 8 | Fase 1 solo con acordeón | 2026-08-09 | Especificación §3.3 |
| 9 | Migraciones SQL manuales, sin Flyway ni Liquibase | 2026-08-09 | Especificación §16.1 |

---

## 5. Decisiones pendientes

Heredadas de la especificación §18. Cada una bloquea trabajo concreto; la columna «bloquea»
indica qué no se puede terminar hasta resolverla.

| # | Decisión | Responsable | Bloquea |
|---|---|---|---|
| 1 | Pasarela de pago definitiva y cobertura internacional | Diego + Tomás | Fase 1 — módulo `pagos` |
| 2 | Precios de los planes mensual y anual | Diego | Landing y `/planes` (hoy provisionales) |
| 3 | Proveedor de streaming de video y presupuesto mensual | Tomás | Fase 1 — módulo `contenido` |
| 4 | ¿Los exámenes prácticos los revisa solo Diego? | Diego | Fase 2 — cola de revisión |
| 5 | Política de reembolsos | Diego | Términos y condiciones |
| 6 | ¿Facturación electrónica DIAN? | Diego + contador | Fase 1 — cierre de compra |
| 7 | Verificación de marca en la SIC, clase 41 | Tomás | Identidad visual definitiva |
| 10 | Cerrar el registro de `diegoromeroacademia.com` en Hostinger — está en «Configuración pendiente» y el DNS mundial responde NXDOMAIN | Tomás | Publicar el entorno de demostración |
| 8 | Alcance geográfico del envío de productos físicos | Diego | Fase 4 — cálculo de envío |
| 9 | Aprobar el uso del servidor físico como entorno de demostración — [ADR 0007](adr/0007-uso-del-servidor-fisico.md), en estado *propuesto* | Tomás | Que Diego pueda revisar pantallas antes de terminar la fase 1 |
| 11 | **Derechos de uso de los tres cuadros vallenatos** entregados el 2026-08-15. Están firmados por otros pintores («Ru…», «momo/2016»). ¿Comprados, encargados, o tomados de internet? | Diego | Que puedan usarse en un sitio comercial. Registro en `activos/originales/LEEME.md` |
| 12 | Sesión de fotos con Diego y su acordeón | Diego | El héroe y las portadas del catálogo. Ninguna foto de banco construye la marca personal |
| 13 | Número de WhatsApp de la academia | Diego | El botón flotante y el del pie no se dibujan sin él |

**Cómo se maneja lo pendiente:** cada decisión abierta se implementa detrás de una interfaz
(puerto) y un valor configurable con un valor por defecto documentado. La decisión cambia
configuración, no código. Ver `docs/03-configuracion.md`.

---

## 6. Estado de las fases

| Fase | Contenido | Estado |
|---|---|---|
| 0 | Reglas, arquitectura y documentación base | **En curso** |
| 1 | Autenticación, catálogo de acordeón, reproductor, pagos, panel, landing | **Frontend construido; sin backend salvo `identidad`** |
| 2 | Exámenes, certificados, compra de tutoriales sueltos | Pendiente |
| 3 | Simulador de pisadas y editor interno de secuencias | Pendiente |
| 4 | Tienda física, inventario, pedidos y guías | Pendiente |
| 5 | Caja y guacharaca, paquete conjunto, blog SEO | Pendiente |

---

## 7. Riesgos vivos

| Riesgo | Impacto | Mitigación adoptada |
|---|---|---|
| Filtración de videos | Alto | Marca de agua identificable, límite de sesiones, HLS con URL firmada |
| El simulador no escala por carga manual de datos | Alto | El editor visual interno es alcance de fase 3, no un extra |
| Cuentas duplicadas por múltiples métodos de login | Medio | Unificación por correo desde el diseño (no negociable #1) |
| Cancelaciones no monitoreadas | Alto | Métrica de bajas del mes visible en el tablero de administración |
| Costos de video superiores a lo previsto | Medio | Estimar consumo por alumno antes de elegir proveedor |
| Vender productos físicos sin stock | Medio | Validación de inventario antes del cobro (no negociable #7) |
| **Deriva de convenciones entre sesiones de IA** | Alto | Reglas escritas, ArchUnit en el build, cobertura obligatoria |
| El servidor de demostración no tiene acceso fuera de banda confirmado | Alto | Solo se llega por Tailscale, tras NAT. Si `tailscaled` o la red no levantan tras un reinicio, hace falta ir físicamente. El servidor tiene iLO 4 (`/dev/ipmi0` presente), pero **falta confirmar si su puerto está cableado y con IP** |
| El servidor no tiene cortafuegos activo | Medio | `ufw` está instalado pero con `ENABLED=no`; el unit figura «active» solo por ser `oneshot`. Lo que protege los servicios es enlazarlos a `127.0.0.1`, no un filtro. Publicar algo en `0.0.0.0` lo sirve a toda la red de la oficina |
| **La landing no puede convertir: el backend no expone ningún controlador** | Alto | Medido el 2026-08-15: `POST /api/acceso/sesion` devuelve 403 y en `backend/src/main` no hay un solo `@RestController`. Hoy no se puede entrar ni registrarse. La landing ya dejó de prometer lo que no existe («— próximamente»), pero **ninguna mejora de la página convierte una visita en alumno** hasta que exista el módulo `identidad`. Es el siguiente trabajo real |
| **La aplicación del estudiante está construida pero vacía por dentro** | Alto | Las 13 pantallas se dibujan con datos simulados: solo `identidad` tiene backend. Cada acción sin respaldo va deshabilitada y con su explicación, y el reproductor lo dice con un rótulo — la interfaz no finge. El riesgo es de EXPECTATIVA: enseñar una tienda y un reproductor completos puede hacer creer que el producto está más cerca de lo que está. La tabla de qué funciona y qué no está en [el proceso](procesos/frontend-app-del-estudiante.md) §4 |
| **La portada en tema oscuro no la diseñó nadie** | Medio | El [ADR 0012](adr/0012-doble-tema-en-todo-el-sitio.md) llevó el doble tema a todo el sitio por decisión del propietario, pero el handoff solo diseñó la variante oscura de la aplicación. La de la portada se deriva de los mismos tokens y cumple contraste medido, pero está pendiente de revisión visual |
| Una imagen cambiada conservando el nombre queda cacheada | Medio | Pasó de verdad: sustituir un acordeón por otro dejó a Cloudflare sirviendo el anterior durante horas, y el propietario veía la página sin cambios. Mitigado con huella de contenido en el nombre (`imagenes:optimizar`) y una prueba que falla si falta. `index.html` va con `Cache-Control: no-cache` |
| `/data` del servidor no tiene ningún respaldo | Medio | No hay restic, borg ni equivalente. Solo existe un volcado lógico de la base de otro proyecto, y vive en el mismo sistema de archivos que protegería. Aplica a `/data/academia/postgres` cuando el catálogo se cargue a mano |

---

## 8. Bitácora

| Fecha | Hecho |
|---|---|
| 2026-08-09 | Especificación maestra v1.0 terminada |
| 2026-08-14 | Sistema visual «Azul rey» aprobado; landing pública diseñada en alta fidelidad |
| 2026-08-14 | Cerradas decisiones de stack, arquitectura, nomenclatura, repositorio e iconografía |
| 2026-08-14 | Marco de buenas prácticas establecido (`docs/01` a `docs/07`) |
| 2026-08-14 | Andamiaje de backend y frontend montado. Corregidas las versiones de framework (ADR 0006) |
| 2026-08-14 | Frontend verificado: compila, lint limpio, 33 pruebas, 100% de cobertura |
| 2026-08-14 | Backend verificado en el servidor: 41 pruebas y las cinco puertas de calidad en verde |
| 2026-08-14 | Imágenes de Docker construidas; la API arranca y responde `UP` contra PostgreSQL |
| 2026-08-15 | Demostración publicada en `diegoromeroacademia.com` por túnel de Cloudflare. Sin contraseña, por decisión del propietario y mientras no haya cuentas ni pagos |
| 2026-08-15 | Pantalla de acceso construida. Landing rediseñada: 8 secciones compuestas, 21 componentes de catálogo |
| 2026-08-15 | Auditoría multiagente de la landing (10 agentes). 10 correcciones aplicadas — la más grave: los 8 CTA apuntaban a `/registro`, que no existía |
| 2026-08-15 | Segunda auditoría (58 agentes, 23 hallazgos verificados). Destapado el héroe, borrada la ruta duplicada, retiradas las promesas sin respaldo |
| 2026-08-15 | Establecido el registro de procedencia de imágenes con licencia, y la huella de contenido en el nombre de archivo |
| 2026-08-16 | Recibido el handoff de la aplicación del estudiante: 14 pantallas en web, tablet y móvil |
| 2026-08-16 | Construidas las 13 pantallas tras iniciar sesión, con armazón, reproductor y simulador de pisadas. 302 pruebas, 93 % de cobertura ([proceso](procesos/frontend-app-del-estudiante.md)) |
| 2026-08-16 | Doble tema claro/oscuro en todo el sitio sobre una capa semántica de tokens ([ADR 0012](adr/0012-doble-tema-en-todo-el-sitio.md)); rutas de la aplicación cerradas ([ADR 0013](adr/0013-rutas-de-la-aplicacion-del-estudiante.md)) |
| 2026-08-16 | Las 13 pantallas publicadas en la demostración. Verificadas en `diegoromeroacademia.com`: enrutado, doble tema con persistencia, carrito, simulador y barra inferior en móvil. **No es producción** — producción sigue siendo Cloud Run y no existe todavía |
| 2026-08-16 | Primera revisión del propietario sobre `/inicio`: ruta y taller igualados, «Tu suscripción» retirada del panel y carrusel de tutoriales con flechas. Destapó que el panel listaba tutoriales SIN comprar bajo «Tutoriales que compraste» ([proceso §5.1](procesos/frontend-app-del-estudiante.md)) |
| 2026-08-16 | Iconografía cambiada a **Material Symbols Rounded** con la escala un escalón arriba ([ADR 0014](adr/0014-iconografia-material-symbols.md), sustituye al 0005). WhatsApp y LinkedIn pasan a `<adr-marca>`: Google retiró las marcas de su catálogo ([proceso §5.2](procesos/frontend-app-del-estudiante.md)) |
| 2026-08-16 | La barra lateral plegada pasa a **riel de iconos de 76 px** en vez de desaparecer: plegarla dejaba la aplicación sin navegación en escritorio. Y en `/suscripcion`, los medios de pago bajan a la tarjeta de cambio de plan ([proceso §5.3](procesos/frontend-app-del-estudiante.md)) |
