# Academia Diego Romero — Documento maestro del proyecto

**Versión:** 1.0
**Fecha:** 9 de agosto de 2026
**Autor:** Oscar Tomás Carrillo Zuleta
**Cliente / propietario de marca:** Diego Romero

---

## 1. Resumen ejecutivo

Plataforma web de formación musical en línea para el mercado hispanohablante, construida sobre la marca personal ya consolidada de Diego Romero (26.000 suscriptores en YouTube, canal `@DiegoRomeroAcordeon`).

El producto combina dos modelos de negocio que hoy están separados en el mercado:

- **Suscripción a cursos estructurados por niveles** (modelo FZ Academia)
- **Venta suelta de tutoriales, instrumentos y accesorios** (modelo Vallenato Máster + tienda)

El diferenciador propio, que ningún competidor tiene, es el **simulador de pisadas de botones** sincronizado con video.

### Referentes

| Referente | Qué tomamos | Qué NO tomamos |
|---|---|---|
| **FZ Academia** (`fzacademia.com`) | El flujo completo: registro → plataforma cerrada → multi-instrumento → exámenes → contenido complementario | La opacidad de precios (no muestran costos hasta registrarse) |
| **Platzi** | El modelo de front: rutas de aprendizaje, tarjetas de curso, barra de progreso, reproductor con lista lateral, certificado verificable | La escala del catálogo |
| **Vallenato Máster** | La claridad comercial: precios visibles, compra inmediata, número de inscritos como prueba social | WordPress como base técnica |

---

## 2. Identidad y dominios

### 2.1 Nombre

- **Marca visible:** Academia Diego Romero
- **Marca corta / logo:** DR
- **Bajada de línea:** Acordeón · Caja · Guacharaca · Guitarra
- **Tagline heredado del canal:** "Aprende a tocar acordeón desde cero"

Decisión: se conserva la marca personal en lugar de una marca institucional, porque el activo real es el reconocimiento de Diego Romero en redes. La audiencia se inscribe con *él*, no con una academia genérica.

### 2.2 Dominios

| Dominio | Rol | Estado |
|---|---|---|
| `diegoromeroacordeon.com` | **Principal.** Aquí vive la plataforma. Coincidencia exacta con el @ del canal. | Adquirido |
| `diegoromeroacademia.com` | Redirección 301 al principal. Reservado para cuando el catálogo sea plenamente multi-instrumento. | Adquirido |

> **⚠ Corregido el 2026-08-15.** Esta tabla ya no describe la realidad, y se conserva tal
> cual porque el historial de la decisión importa:
>
> - **`diegoromeroacordeon.com` nunca se adquirió.** No aparece en el panel del registrador y
>   el DNS mundial responde `NXDOMAIN`. Sigue libre para quien lo compre.
> - **`diegoromeroacademia.com` pasa a ser el dominio del proyecto**, no una redirección.
>   Su registro está pendiente de cerrar en el registrador.
>
> Consecuencia asumida: la dirección ya no coincide con el `@DiegoRomeroAcordeon` del canal,
> que era el argumento original de §2.2. Quien vea el canal y escriba el dominio de memoria
> se equivocará. Ver `docs/00-contexto.md §4`, decisión 7b.

**Pendientes de marca:**

- Verificar en la SIC (Superintendencia de Industria y Comercio) la clase 41 — servicios de educación y formación — antes de invertir en identidad visual.
- Reservar los handles `@academiadiegoromero` en las redes donde aún no exista.
- Revisar el precio de renovación de los dominios (la promoción de primer año no aplica a renovaciones).

---

## 3. Modelo de negocio

### 3.1 Fuentes de ingreso

1. **Suscripción mensual** — acceso a todo el catálogo de cursos mientras esté vigente.
2. **Suscripción anual** — mismo acceso, con descuento. Es el plan a promover.
3. **Curso o tutorial suelto** — pago único, acceso permanente a ese recurso.
4. **Tienda física** — instrumentos, accesorios, libros y partituras.

### 3.2 Regla central de acceso

> La suscripción da acceso **temporal** a los cursos. La compra suelta da acceso **permanente** a lo comprado.

Cuando la suscripción vence:

- Pierde acceso a los cursos incluidos en el plan.
- **Conserva** para siempre: tutoriales comprados sueltos, certificados obtenidos, historial de progreso.

Esta regla debe estar escrita en los términos y condiciones, porque es la principal fuente de reclamos en plataformas de suscripción.

### 3.3 Estrategia de lanzamiento

Fase 1 debe salir solo con **acordeón**. El activo hoy es "el que enseña acordeón vallenato". Diluirse antes de consolidar es el riesgo más grande del proyecto.

Orden recomendado de expansión:

1. **Acordeón** (lanzamiento)
2. **Caja y guacharaca** — extensión natural, misma audiencia, mismo género. Hay muy poco material formal de guacharaca en internet: nicho vacío que Diego domina.
3. **Paquete "Conjunto vallenato"** — los tres instrumentos combinados.
4. **Guitarra** — evaluar a los 12 meses con datos reales de demanda. Audiencia distinta y competencia enorme.

---

## 4. Actores del sistema

| Actor | Descripción | Permisos clave |
|---|---|---|
| **Visitante** | No autenticado. Ve landings, blog y precios. | Solo lectura pública |
| **Estudiante** | Registrado. Con o sin suscripción activa. | Ve lo que su `acceso_recurso` permita |
| **Instructor** | Diego u otros profesores. | Califica exámenes prácticos, responde dudas |
| **Administrador** | Diego o quien él designe. | Catálogo, inventario, usuarios, reportes |

---

## 5. Autenticación y acceso

### 5.1 Métodos soportados

| Método | Prioridad | Notas |
|---|---|---|
| **Google (OAuth 2.0)** | Alta | Reduce fricción drásticamente. Elimina el soporte por contraseñas olvidadas, que en este público es constante. |
| **Facebook Login** | Media | El público vallenato es fuertemente activo en Facebook. La cuenta de Diego ya tiene presencia allí. |
| **Correo y contraseña** | Alta | Obligatorio como respaldo. No todos tienen Google o Facebook activos. |

### 5.2 Regla crítica: unificación de cuentas

> Un mismo correo debe resolver siempre a la **misma cuenta**, sin importar el método de ingreso.

Si un estudiante se registra con correo y contraseña, y luego entra con Google usando ese mismo correo, debe caer en la misma cuenta. De lo contrario se generan usuarios duplicados que pagaron y "perdieron" su curso — uno de los errores de soporte más caros y frecuentes.

Implementación: tabla `usuario` con el correo como identificador único, y tabla `identidad_externa` (proveedor, id_externo, usuario_id) que vincula uno o más proveedores a la misma cuenta.

### 5.3 Consideraciones técnicas

- Verificación de correo obligatoria para el registro tradicional.
- Recuperación de contraseña por token con expiración.
- Sesiones con JWT de vida corta más refresh token.
- Límite razonable de dispositivos simultáneos por cuenta (sugerido: 2), para frenar el préstamo de credenciales.
- Roles y permisos validados **en cada capa**, nunca solo en el front.

---

## 6. Flujo del estudiante

```
Landing / YouTube / WhatsApp
        ↓
Registro o login (Google · Facebook · correo)
        ↓
Onboarding: ¿qué instrumento? ¿qué nivel?
        ↓
Selección de plan → Pasarela de pago
        ↓
   ┌────────────┼────────────┐
   ↓            ↓            ↓
Mis cursos   Práctica     Tienda
   ↓            ↓            ↓
Niveles     Simulador   Carrito y pago
   ↓            ↓            ↓
Examen                  Entrega
   ↓
Certificado digital
```

### 6.1 Pantallas del recorrido

| # | Pantalla | Ruta | Contenido |
|---|---|---|---|
| 1 | Landing pública | `/` | Propuesta de valor, instrumentos, precios visibles, CTA |
| 2 | Landing por instrumento | `/como-tocar-acordeon-vallenato` | Página SEO por curso, con URL descriptiva |
| 3 | Acceso | `/login` | Google, Facebook, correo. Enlace a registro y recuperación |
| 4 | Bienvenida / onboarding | `/bienvenida` | Instrumento de interés y nivel autodeclarado |
| 5 | Planes | `/planes` | Anual (destacado), mensual, curso suelto |
| 6 | Confirmación de pago | `/pago/confirmado` | Estado y acceso inmediato |
| 7 | Mis cursos | `/mis-cursos` | Tarjetas con progreso independiente por curso |
| 8 | Ruta de niveles | `/curso/{slug}` | Niveles completados, actual y bloqueados con candado |
| 9 | Reproductor | `/clase/{id}` | Video protegido, lista lateral, recursos, marca de agua |
| 10 | Examen | `/nivel/{id}/examen` | Teoría automática más envío de video práctico |
| 11 | Práctica | `/practica` | Catálogo de ejercicios por instrumento y dificultad |
| 12 | Simulador | `/practica/{ejercicio}` | Video más botones resaltados en tiempo real |
| 13 | Certificados | `/certificados` | Lista, descarga en PDF y enlace de verificación |
| 14 | Tienda | `/tienda` | Catálogo de digitales y físicos |
| 15 | Carrito | `/carrito` | Validación de stock antes de cobrar |
| 16 | Mis compras | `/mis-compras` | Digitales disponibles, físicos con estado de envío |
| 17 | Perfil | `/perfil` | Datos, métodos de pago, suscripción, dispositivos |

---

## 7. Módulo de cursos y progresión

### 7.1 Estructura jerárquica

```
Instrumento (acordeón, caja, guacharaca, guitarra)
  └─ Curso (curso completo de acordeón vallenato)
      └─ Nivel (1, 2, 3, 4 — secuencial y bloqueante)
          └─ Módulo (bloque temático dentro del nivel)
              └─ Clase (unidad de video)
                  └─ Recursos (partitura, pista, PDF)
```

### 7.2 Regla de progresión

> El progreso es **por curso**, no por estudiante.

Un mismo estudiante puede estar en nivel 1 de acordeón y nivel 2 de guitarra al mismo tiempo. Cada inscripción lleva su propio contador.

- El nivel N+1 permanece bloqueado hasta **aprobar el examen** del nivel N.
- Dentro de un nivel desbloqueado, el estudiante navega libremente entre módulos y clases.
- Los niveles ya aprobados quedan siempre accesibles para repaso.
- El desbloqueo se valida **en el backend**, nunca solo ocultando el botón en el front.

### 7.3 Exámenes

Modelo mixto, tomado y ampliado de FZ Academia:

| Componente | Calificación | Peso sugerido |
|---|---|---|
| Preguntas de teoría (opción múltiple) | Automática por el sistema | 40% |
| Video del estudiante tocando el ejercicio | Manual, la revisa el instructor | 60% |

La revisión manual no es solo control de calidad: es el contacto humano que retiene alumnos y diferencia la academia de un canal de YouTube.

Estados posibles: `pendiente`, `en_revision`, `aprobado`, `rechazado` (con retroalimentación escrita y reintento permitido).

---

## 8. Módulo de práctica y simulador

Es el diferenciador competitivo del proyecto. Ni FZ Academia ni Vallenato Máster tienen algo equivalente.

### 8.1 Funcionamiento

1. El estudiante entra a `/practica` y elige un ejercicio, filtrando por instrumento y dificultad.
2. Se carga el video del ejercicio en la parte superior.
3. Debajo se muestra el **diagrama de botones del acordeón** (o el elemento equivalente para caja y guacharaca).
4. A medida que avanza el video, el simulador **resalta los botones que deben presionarse** en ese instante.
5. Controles de práctica: velocidad reducida (BPM ajustable), repetición de fragmento (loop A–B), y opción de silenciar la pista guía.

### 8.2 Requisito de datos

Cada ejercicio necesita una **secuencia de pisadas con marca de tiempo**:

```json
{
  "ejercicio_id": 7,
  "instrumento": "acordeon",
  "afinacion": "FBE",
  "bpm_original": 90,
  "secuencia": [
    { "t_ms": 0,    "fuelle": "abre", "botones": ["m3"],       "duracion_ms": 250 },
    { "t_ms": 250,  "fuelle": "abre", "botones": ["m4"],       "duracion_ms": 250 },
    { "t_ms": 500,  "fuelle": "cierra","botones": ["m4","b2"], "duracion_ms": 500 }
  ]
}
```

Consideraciones específicas del acordeón diatónico:

- Un mismo botón produce **notas distintas al abrir y al cerrar** el fuelle. La dirección del fuelle es dato obligatorio, no opcional.
- Hay que registrar la **afinación** del acordeón (FBE, GCF, etc.), porque el diagrama cambia.
- Se deben modelar por separado la mano derecha (pitos) y la mano izquierda (bajos).

### 8.3 Herramienta interna obligatoria

Alguien tiene que cargar esa secuencia para cada ejercicio. **Sin un editor visual interno, este módulo no escala.**

Debe construirse un editor donde el instructor reproduce el video y marca los botones sobre una línea de tiempo, generando el JSON automáticamente. Esta herramienta es parte del alcance, no un extra.

---

## 9. Certificados digitales

- Se emiten al **aprobar el examen** de un nivel o al completar un módulo definido como certificable.
- Formato PDF con: nombre completo del estudiante, documento de identidad, curso, nivel, fecha de emisión, firma de Diego Romero y **código único de verificación**.
- Página pública de verificación: `/verificar/{codigo}`, que muestra si el certificado es válido y a quién pertenece.

> Un PDF suelto no lo respeta nadie. Uno verificable sí sirve para mostrar.

Los certificados **no se pierden** aunque la suscripción venza.

---

## 10. Tienda e inventario

### 10.1 Dos tipos de producto, dos comportamientos

| | Producto digital | Producto físico |
|---|---|---|
| Ejemplos | Tutorial suelto, partitura, pista | Guacharaca, caja, correas, libros |
| Entrega | Inmediata, escribe en `acceso_recurso` | Requiere dirección y envío |
| Inventario | No aplica | Descuenta stock |
| Costo de envío | No | Sí, calculado por destino |
| Estados | `disponible` | `preparando`, `enviado`, `entregado` |

Misma tienda, dos flujos. Es la distinción más importante del módulo.

### 10.2 Gestión de inventario

- El administrador crea, edita, activa y desactiva productos.
- Cada venta descuenta stock automáticamente.
- **Validación de stock antes de cobrar.** Vender algo que no se tiene es el error más caro de una tienda pequeña.
- Alerta configurable de stock bajo.
- Historial de movimientos: entradas, salidas, ajustes manuales con motivo y responsable.
- Producto agotado: visible pero no comprable, con opción de "avísame cuando llegue".

### 10.3 Logística

Al vender instrumentos se entra en logística real. Se requiere:

- Registro de número de guía por pedido.
- Estados visibles para el estudiante en `/mis-compras`.
- Notificación por correo en cada cambio de estado.

Sin esto, el soporte se convierte en un canal de WhatsApp saturado.

---

## 11. Pagos

### 11.1 Alcance

Una sola integración de pasarela debe habilitar:

- Suscripciones recurrentes (mensual y anual)
- Compras únicas de recursos digitales
- Compras de productos físicos con envío

### 11.2 Pasarelas candidatas (Colombia)

| Opción | A favor | A revisar |
|---|---|---|
| **Wompi** (Bancolombia) | Fuerte en Colombia, PSE, Nequi, tarjetas. Buena documentación. | Cobertura internacional limitada |
| **Mercado Pago** | Alcance en toda Latinoamérica, muy reconocido | Comisiones |
| **PayU** | Multipaís, tarjetas internacionales | Integración más pesada |
| **Stripe** | Lo mejor para suscripciones y alumnos fuera de Colombia | Disponibilidad y requisitos en Colombia |

Dato relevante: FZ Academia declara estudiantes en 17 países. Si se apunta a ese alcance, hace falta una pasarela con cobertura internacional o una combinación de dos.

### 11.3 Regla de arquitectura

> El acceso nace de dos fuentes, pero se guarda en **una sola tabla**.

Tanto la suscripción activa como la compra individual escriben en `acceso_recurso`. Así nunca se pregunta "¿pagó?" en dos lugares distintos con lógicas diferentes.

El webhook de la pasarela es la única fuente de verdad para confirmar un pago. Nunca se habilita acceso desde el front.

---

## 12. Protección de video

### 12.1 Requisito

Los videos no deben poder descargarse por ningún medio ordinario.

### 12.2 Medidas

1. **Streaming HLS segmentado** — el video se sirve en fragmentos, no como archivo único.
2. **URLs firmadas de vida corta** — tokens que expiran en minutos y se validan contra la sesión del usuario.
3. **Marca de agua dinámica** — nombre y documento del estudiante superpuestos sobre el video, en posición variable.
4. **Validación de origen** — el reproductor solo funciona desde el dominio autorizado.
5. **Límite de sesiones simultáneas** por cuenta.
6. **DRM (Widevine / FairPlay)** — opcional, para una fase posterior. Encarece la infraestructura de forma considerable.

### 12.3 Advertencia honesta

> El blindaje total no existe. Quien graba pantalla siempre puede.

La marca de agua no impide la copia, pero **identifica al que filtró**, que es lo que realmente disuade. Es importante que Diego entienda esto desde el inicio para no prometer algo imposible ni sobreinvertir en DRM.

---

## 13. Panel de administración

| Sección | Funciones |
|---|---|
| **Tablero** | Estudiantes activos, ingresos del mes, bajas del mes, avance promedio |
| **Catálogo** | Crear y editar instrumentos, cursos, niveles, módulos y clases. Publicar, ocultar y reordenar |
| **Contenido** | Subir videos, adjuntar recursos, configurar exámenes |
| **Ejercicios** | Editor visual de secuencias del simulador |
| **Estudiantes** | Buscar, ver progreso, otorgar acceso manual, suspender |
| **Exámenes** | Cola de videos por revisar, calificar con retroalimentación |
| **Suscripciones** | Definir planes, precios, cupones y promociones |
| **Tienda** | Productos, precios, stock, pedidos y guías |
| **Reportes** | Ingresos, retención, cursos más vistos, puntos de abandono |

**Métrica clave:** en un modelo de suscripción, las **bajas del mes** importan más que las ventas del mes. El tablero debe mostrarlas de forma prominente.

---

## 14. Modelo de front (referente: Platzi)

### 14.1 Principios de interfaz

- **Diseño de tarjetas, responsive**, coherente con la línea de trabajo ya usada en otros proyectos.
- **Mobile first.** La mayoría del tráfico vendrá de YouTube en celular.
- Menús colapsables en móvil.
- Comunicación backend–frontend íntegramente en JSON.
- Pantalla de acceso visualmente cuidada, con los tres botones de ingreso bien jerarquizados.

### 14.2 Elementos tomados de Platzi

| Elemento | Aplicación |
|---|---|
| Ruta de aprendizaje | La progresión visual de niveles con estados: completado, actual, bloqueado |
| Tarjeta de curso con barra de progreso | Pantalla "Mis cursos" |
| Reproductor con lista lateral | Clase actual resaltada, siguiente clase siempre visible |
| Marcado de clase vista | Registro automático de avance |
| Recursos descargables por clase | Partituras y pistas |
| Certificado verificable | Con código público de validación |
| Continuidad | Botón permanente de "continuar donde quedaste" |

### 14.3 Elementos tomados de FZ Academia

- Registro obligatorio para entrar a la plataforma (contenido cerrado).
- Landing por instrumento con URL descriptiva, orientada a SEO.
- Widget flotante de WhatsApp con mensaje precargado (nombre e instrumento).
- Blog en el mismo dominio, para captar tráfico que no viene del canal.
- Exámenes y contenido complementario como parte del valor del plan.
- Sección de respaldo institucional, si se consiguen aliados.

---

## 15. Modelo de datos (esquema conceptual)

### 15.1 Identidad y acceso

| Tabla | Campos principales |
|---|---|
| `usuario` | id, nombre, correo (único), documento, telefono, pais, rol, estado, creado_en |
| `identidad_externa` | id, usuario_id, proveedor (`google`, `facebook`), id_externo, correo_proveedor |
| `sesion` | id, usuario_id, dispositivo, ip, token_refresh, expira_en |
| `suscripcion` | id, usuario_id, plan_id, estado, inicio, fin, renovacion_automatica |
| `plan` | id, nombre, precio, periodicidad, activo |
| `acceso_recurso` | id, usuario_id, tipo_recurso, recurso_id, origen (`suscripcion`/`compra`), vence_en (nulo = permanente) |

### 15.2 Contenido

| Tabla | Campos principales |
|---|---|
| `instrumento` | id, nombre, slug, activo |
| `curso` | id, instrumento_id, nombre, slug, descripcion, publicado |
| `nivel` | id, curso_id, numero, nombre, certificable |
| `modulo` | id, nivel_id, nombre, orden |
| `clase` | id, modulo_id, titulo, video_id, duracion, orden |
| `recurso` | id, clase_id, tipo, nombre, archivo_url |
| `inscripcion` | id, usuario_id, curso_id, nivel_actual, iniciado_en |
| `avance_clase` | id, inscripcion_id, clase_id, completada, segundo_ultimo, actualizado_en |

### 15.3 Evaluación

| Tabla | Campos principales |
|---|---|
| `examen` | id, nivel_id, puntaje_minimo |
| `pregunta` | id, examen_id, enunciado, tipo |
| `opcion` | id, pregunta_id, texto, correcta |
| `intento_examen` | id, usuario_id, examen_id, puntaje_teoria, video_url, estado, retroalimentacion, revisado_por |
| `certificado` | id, usuario_id, nivel_id, codigo_unico, emitido_en, pdf_url |

### 15.4 Práctica

| Tabla | Campos principales |
|---|---|
| `ejercicio` | id, instrumento_id, nombre, dificultad, video_id, bpm_original, afinacion |
| `secuencia_pisada` | id, ejercicio_id, t_ms, duracion_ms, direccion_fuelle, botones (JSON), mano |

### 15.5 Comercio

| Tabla | Campos principales |
|---|---|
| `producto` | id, tipo (`digital`/`fisico`), nombre, descripcion, precio, activo |
| `inventario` | id, producto_id, stock, stock_minimo |
| `movimiento_inventario` | id, producto_id, tipo, cantidad, motivo, usuario_id, fecha |
| `pedido` | id, usuario_id, total, estado, direccion_envio, guia |
| `pedido_item` | id, pedido_id, producto_id, cantidad, precio_unitario |
| `pago` | id, usuario_id, pasarela, referencia_externa, monto, estado, payload (JSON) |

> **Nota de diseño:** aunque la fase 1 salga solo con acordeón, la tabla `instrumento` y las llaves foráneas deben existir desde el día uno. Cambiar eso después duele.

---

## 16. Arquitectura técnica propuesta

### 16.1 Stack

| Capa | Tecnología | Justificación |
|---|---|---|
| Backend | Java 21 + Spring Boot 3 | Consistente con la línea técnica ya establecida |
| Base de datos | PostgreSQL | Migraciones SQL manuales, sin Flyway ni Liquibase |
| Frontend | Angular 18 | Consistente con los demás proyectos |
| Video | Servicio de streaming con HLS y URLs firmadas | Bunny Stream, Cloudflare Stream o Mux |
| Almacenamiento | Google Cloud Storage | Recursos y PDFs |
| Despliegue | Cloud Run / GCP | Contenedores, escalado automático |
| Correo | SendGrid | Notificaciones transaccionales |
| Mensajería | WhatsApp Business API | Captación y soporte |

### 16.2 Principios de arquitectura

- Portable en la nube, desacoplada de la infraestructura específica.
- Configuración por variables de entorno y secretos externos. Sin secretos en el código.
- Sin rutas absolutas.
- Permisos por rol validados en cada capa.
- Comunicación JSON de extremo a extremo.
- `RestTemplate` para clientes HTTP.
- Escalabilidad y mantenibilidad como prioridades.

---

## 17. Fases de entrega

### Fase 1 — Base (MVP)

- Autenticación con Google, Facebook y correo, con unificación de cuentas
- Catálogo de acordeón con niveles y progresión bloqueante
- Reproductor con video protegido y marca de agua
- Pasarela de pagos con suscripción mensual y anual
- Panel de administración: catálogo y estudiantes
- Landing pública con precios visibles

### Fase 2 — Evaluación y certificación

- Exámenes mixtos (teoría automática, práctica manual)
- Cola de revisión para el instructor
- Emisión de certificados con verificación pública
- Compra de tutoriales sueltos

### Fase 3 — Diferenciador

- Simulador de pisadas
- Editor interno de secuencias
- Controles de práctica: BPM ajustable y loop A–B

### Fase 4 — Comercio

- Tienda con productos físicos
- Inventario, pedidos y guías
- Cupones y promociones

### Fase 5 — Expansión

- Caja y guacharaca
- Paquete "Conjunto vallenato"
- Blog y contenido SEO
- Evaluación de guitarra con datos reales

---

## 18. Decisiones pendientes

| # | Decisión | Responsable |
|---|---|---|
| 1 | Pasarela de pago definitiva y su cobertura internacional | Diego + Tomás |
| 2 | Precios de los planes mensual y anual | Diego |
| 3 | Proveedor de streaming de video y presupuesto mensual | Tomás |
| 4 | ¿Los exámenes prácticos los revisa solo Diego o habrá más instructores? | Diego |
| 5 | Política de reembolsos | Diego |
| 6 | ¿Se factura electrónicamente? (habilitación DIAN) | Diego + contador |
| 7 | Verificación de marca en la SIC, clase 41 | Tomás |
| 8 | Alcance geográfico del envío de productos físicos | Diego |

---

## 19. Riesgos identificados

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Filtración de videos | Alto | Marca de agua identificable, límite de sesiones, términos claros |
| Dilución de marca por lanzar demasiados instrumentos a la vez | Alto | Lanzar solo acordeón en fase 1 |
| Cuentas duplicadas por múltiples métodos de login | Medio | Unificación por correo desde el diseño |
| Vender productos físicos sin stock | Medio | Validación de inventario antes del cobro |
| El simulador no escala por carga manual de datos | Alto | Editor interno como parte del alcance, no como extra |
| Costos de video superiores a lo previsto | Medio | Estimar consumo por alumno antes de elegir proveedor |
| Cancelaciones de suscripción no monitoreadas | Alto | Métrica de retención visible en el tablero |

---

## 20. Anexos

### 20.1 Diagramas en Lucid

- **Flujo del estudiante:** `https://lucid.app/lucidchart/a205ebc5-a654-4bf1-a03f-833da9b07c3e/edit`
- **Motor de accesos y administración:** `https://lucid.app/lucidchart/95633997-d2dd-430b-afbc-a39139c3fd8d/edit`

### 20.2 Referentes analizados

- FZ Academia — `https://www.fzacademia.com/` — plataforma propia en Next.js, video en AWS S3, seis cursos multi-instrumento, contenido cerrado tras registro, captación por WhatsApp, respaldo de Apps.co, iNNpulsa y MinTIC.
- Vallenato Máster — `https://vallenatomaster.com/cursos/` — WordPress con WooCommerce y LMS, tres niveles de precio, número de inscritos público como prueba social.
- Platzi — modelo de front: rutas de aprendizaje, progreso visible, certificado verificable.

### 20.3 Canal de origen

- YouTube: `https://youtube.com/@DiegoRomeroAcordeon` — 26.000 suscriptores, 362 videos, secciones de cursos y listas ya organizadas por temática.
