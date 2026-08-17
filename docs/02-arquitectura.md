# 02 · Arquitectura

**Cubre las reglas 3, 6, 9 y 13 del proyecto.**

---

## 1. Decisión

**Monolito modular con arquitectura hexagonal (puertos y adaptadores).**

Un solo artefacto desplegable, dividido internamente en módulos de dominio con fronteras
reales verificadas por el build. No microservicios: a esta escala solo agregarían complejidad
distribuida sin beneficio. Pero cada módulo queda lo bastante aislado como para extraerse
más adelante si alguno lo justifica.

Razonamiento completo en [`adr/0003-arquitectura-hexagonal-modular.md`](adr/0003-arquitectura-hexagonal-modular.md).

---

## 2. Módulos

La división es **por dominio de negocio**, nunca por capa técnica. No existe un paquete
`servicios` global ni un `controladores` global.

| Módulo | Responsabilidad | Fase |
|---|---|---|
| `identidad` | Usuario, identidad externa, sesiones, roles, unificación de cuentas | 1 |
| `catalogo` | Instrumento, curso, nivel, módulo, clase, recurso | 1 |
| `aprendizaje` | Inscripción, avance de clase, desbloqueo de niveles | 1 |
| `contenido` | Video protegido, URL firmada, marca de agua, almacenamiento | 1 |
| `acceso` | `acceso_recurso` — **el único juez de qué puede ver un usuario** | 1 |
| `pagos` | Pasarela, webhooks, suscripciones, planes | 1 |
| `evaluacion` | Exámenes, intentos, revisión, certificados | 2 |
| `practica` | Ejercicios, secuencias de pisada, simulador | 3 |
| `comercio` | Productos, inventario, pedidos, envíos | 4 |
| `notificacion` | Correo transaccional, WhatsApp | Transversal |
| `administracion` | Tablero, reportes, herramientas internas | 1–4 |
| `compartido` | Objetos de valor y utilidades sin dueño claro. **Debe permanecer diminuto** | — |

`compartido` es el módulo que se corrompe primero en todo proyecto. Regla: solo entra ahí lo
que usan **tres o más** módulos y no tiene reglas de negocio propias. Todo lo demás pertenece
a algún dominio.

---

## 3. Estructura de carpetas

```
diegoromeroacademia/
├── CLAUDE.md
├── docs/
│   ├── 00-contexto.md … 07-proceso.md
│   ├── especificacion-maestra.md
│   ├── adr/
│   └── procesos/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/academiadiegoromero/
│       │   ├── AcademiaAplicacion.java
│       │   ├── configuracion/          ← configuración transversal
│       │   ├── compartido/
│       │   └── <modulo>/
│       │       ├── dominio/
│       │       │   ├── modelo/         ← entidades y objetos de valor puros
│       │       │   ├── puerto/         ← interfaces que el dominio necesita
│       │       │   ├── servicio/       ← reglas que no caben en una entidad
│       │       │   └── excepcion/
│       │       ├── aplicacion/
│       │       │   ├── casouso/        ← orquestación, transacciones
│       │       │   └── dto/
│       │       └── infraestructura/
│       │           ├── web/            ← controladores REST
│       │           ├── persistencia/   ← entidades JPA, repositorios, mapeadores
│       │           ├── cliente/        ← adaptadores a servicios externos
│       │           └── configuracion/
│       ├── main/resources/
│       │   ├── application.yml
│       │   └── db/migracion/           ← V001__crear_usuario.sql, …
│       └── test/java/…
└── frontend/
    ├── package.json
    ├── eslint.config.js
    ├── scripts/
    │   └── generar-iconos.mjs   ← regenera el registro de iconos Material Symbols
    └── src/
        ├── index.html
        ├── main.ts
        ├── entornos/            ← entorno.ts (prod) y entorno.desarrollo.ts
        └── app/
            ├── app.ts · app.config.ts · app.routes.ts
            ├── nucleo/          ← servicios singleton, interceptores, guardas, modelos de API
            ├── compartido/
            │   └── componentes/ ← catálogo reutilizable (docs/04 §3)
            ├── disenio/         ← _tokens.scss, _mixins.scss, global.scss, iconos/
            └── funcionalidades/ ← una carpeta por pantalla o dominio
                ├── acceso/
                ├── mis-cursos/
                ├── curso/
                ├── clase/
                ├── practica/
                ├── tienda/
                └── admin/
```

**El nombre del módulo aparece antes que el nombre de la capa.** Es
`catalogo/dominio/modelo/Curso.java`, nunca `dominio/catalogo/Curso.java`. Así todo lo de un
dominio vive junto y se puede trabajar en `pagos` sin abrir un solo archivo de `catalogo`.

---

## 4. Flujo de una petición

```
HTTP → Controlador → CasoUso → Dominio (reglas) → Puerto ← Adaptador → PostgreSQL
        (traduce)   (orquesta)  (decide)          (interfaz) (implementa)
```

Ejemplo real: reproducir una clase.

```
GET /api/clases/{id}/reproduccion
  → ClaseControlador               traduce la petición y extrae el usuario autenticado
  → ObtenerReproduccionCasoUso     orquesta
      → AccesoRecursoServicio      ¿tiene acceso vigente? (dominio, sin BD)
      → UrlFirmadaPuerto           pide URL de vida corta
          ← BunnyStreamAdaptador   implementación concreta
  → ReproduccionRespuesta          DTO de salida
```

Los cuatro puntos de control de este flujo —autenticación, acceso al recurso, vigencia de la
suscripción y firma del video— viven en el backend. **Ninguno se delega al frontend.**

---

## 5. Reglas de dependencia (verificadas por ArchUnit)

Estas pruebas viven en `backend/src/test/java/com/academiadiegoromero/arquitectura/` y corren
en cada `./mvnw verify`. Son el mecanismo que hace que la regla 3 (sin espagueti) se cumpla
sola en vez de depender de la disciplina.

```java
// El dominio no puede depender de ningún framework: es lo que permite probarlo sin
// levantar Spring y lo que hace que cambiar de tecnología no toque las reglas de negocio.
@ArchTest
static final ArchRule elDominioEsPuro = noClasses()
    .that().resideInAPackage("..dominio..")
    .should().dependOnClassesThat().resideInAnyPackage(
        "org.springframework..", "jakarta.persistence..",
        "com.fasterxml.jackson..", "..infraestructura.."
    );

// Los módulos solo se comunican por sus casos de uso publicados o por eventos de dominio.
// Alcanzar el dominio interno de otro módulo crea acoplamiento invisible.
@ArchTest
static final ArchRule losModulosNoSeInvadenPorDentro = SlicesRuleDefinition
    .slices().matching("com.academiadiegoromero.(*)..")
    .should().notDependOnEachOther()
    .ignoreDependency(alwaysTrue(), resideIn("..compartido.."));

// Un ciclo entre módulos significa que falta un evento de dominio.
@ArchTest
static final ArchRule sinCiclos = slices()
    .matching("com.academiadiegoromero.(*)..").should().beFreeOfCycles();

// La lógica de negocio no puede vivir en un controlador.
@ArchTest
static final ArchRule losControladoresNoTocanRepositorios = noClasses()
    .that().haveSimpleNameEndingWith("Controlador")
    .should().dependOnClassesThat().haveSimpleNameEndingWith("Repositorio");

// La inyección por campo oculta cuántas dependencias tiene realmente una clase.
@ArchTest
static final ArchRule sinInyeccionPorCampo = noFields()
    .should().beAnnotatedWith(Autowired.class);

// Cada sufijo pertenece a una capa. Un adaptador dentro del dominio es un error de diseño.
@ArchTest
static final ArchRule sufijosEnSuCapa = classes()
    .that().haveSimpleNameEndingWith("Adaptador")
    .should().resideInAPackage("..infraestructura..");
```

---

## 6. Comunicación entre módulos

Tres formas permitidas, en este orden de preferencia:

1. **Evento de dominio** (preferido). `pagos` publica `PagoConfirmadoEvento`; `acceso` lo
   escucha y otorga el acceso. Los módulos no se conocen. Se usa `ApplicationEventPublisher`
   con `@TransactionalEventListener(phase = AFTER_COMMIT)` — el acceso se otorga solo si la
   transacción del pago realmente se confirmó.
2. **Caso de uso publicado.** Una interfaz explícita en `<modulo>/aplicacion/casouso/` marcada
   como API del módulo. El llamador depende de la interfaz, nunca de la implementación.
3. **Consulta de solo lectura** para pantallas que agregan datos de varios dominios (el
   tablero de administración). Vive en `administracion` y usa proyecciones, no entidades.

**Nunca:** una entidad JPA de un módulo referenciada desde otro, ni un repositorio ajeno
inyectado directamente.

---

## 7. Persistencia

- **Migraciones SQL manuales versionadas** en `db/migracion/`, formato `V###__descripcion.sql`
  (decisión de la especificación §16.1). Una migración publicada **nunca se edita**: se corrige
  con una nueva.
- Las entidades JPA (`…Entidad`) viven solo en `infraestructura/persistencia/` y **no salen de
  ahí**. Un mapeador las convierte al modelo de dominio.
- El modelo de dominio no sabe que existe una base de datos.
- Índices obligatorios desde el día uno: `usuario.correo` (único), `acceso_recurso
  (usuario_id, tipo_recurso, recurso_id)`, `inscripcion (usuario_id, curso_id)` (único),
  `avance_clase (inscripcion_id, clase_id)` (único).
- Sin borrado físico de datos de negocio: baja lógica con `estado` y `anulado_en`.
- La tabla `instrumento` y sus llaves foráneas existen desde el día uno aunque la fase 1 solo
  publique acordeón. Cambiar eso después duele (especificación §15, nota de diseño).

---

## 8. Diseño para 1000 alumnos concurrentes

La regla 13 se traduce en decisiones concretas, no en una aspiración:

| Decisión | Motivo |
|---|---|
| El video **no pasa por el backend** | Se sirve por HLS desde el proveedor con URL firmada. El backend solo firma. Es lo que hace que 1000 alumnos concurrentes sean irrelevantes para la carga de la aplicación |
| Virtual threads activos | Concurrencia alta sin complicar el modelo de programación |
| Sin estado en memoria de la aplicación | Requisito para escalar horizontalmente en Cloud Run |
| Caché de catálogo | El catálogo se lee miles de veces y cambia poco. Caffeine local, invalidado al publicar |
| Paginación obligatoria | Todo endpoint de listado pagina. **No existe un `listarTodos()` sin límite** |
| Sin consultas N+1 | Verificado en tests de integración que cuentan las consultas emitidas |
| Índices antes que optimización | Definidos junto con la migración, no después de que duela |
| `min-instances = 1` en Cloud Run | Evita que un alumno pague el arranque en frío de la JVM |
| Webhooks idempotentes | Las pasarelas reintentan. Procesar dos veces un pago es inaceptable |

---

## 9. Frontend

- **Standalone components**, sin `NgModule`. Es el modo por defecto en Angular 21.
- **Zoneless**: no hay `zone.js`. La detección de cambios la dispara el sistema de signals,
  lo que hace obligatorio que el estado viva en signals y no en propiedades sueltas.
- `ChangeDetectionStrategy.OnPush` en todo componente, impuesto por ESLint.
- Carga diferida por funcionalidad con `loadComponent`: `/admin` y `/practica` no pesan en el
  bundle de la landing.
- `nucleo/` contiene los servicios singleton, el interceptor de autenticación, el manejador de
  errores y las guardas de ruta. Los interceptores se registran **solo** en `app.config.ts`.
- `compartido/componentes/` es el catálogo de `docs/04`. **Una pantalla nunca crea su propio
  botón, modal ni panel.**
- `disenio/` contiene los tokens y el registro de iconos. Ningún componente escribe un color
  literal.
- Las guardas de ruta son para experiencia de usuario, **no para seguridad**: la autorización
  real siempre está en el backend.
- Estado: signals a nivel de componente y un servicio con signals por funcionalidad. No se
  introduce NgRx salvo que un ADR lo justifique.

### Presupuesto de bundle

El build de producción falla si el bundle inicial supera **1 MB** y avisa a los 500 kB.
Con la mayoría del tráfico llegando desde YouTube en celular (especificación §14.1), cada
100 kB de más son segundos de espera en una conexión móvil.

**Estilos por componente: aviso a 6 kB, error a 10 kB.** El valor por defecto de Angular
(4 kB / 8 kB) está calibrado para componentes pequeños. Los del catálogo se mueven entre
1 y 4 kB y lo cumplen de sobra; los de pantalla completa —landing, acceso— rondan los 5-7 kB
de forma legítima. Se subió el umbral porque un aviso que salta siempre deja de leerse, y
entonces ya no protege de nada.

Si un componente del catálogo se acerca a los 6 kB, el problema no es el presupuesto: es que
está haciendo demasiado y hay que partirlo (docs/01 §8).
