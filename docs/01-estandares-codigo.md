# 01 · Estándares de código

**Cubre las reglas 1, 2, 3, 7, 8 y 9 del proyecto.**

Este documento no es una guía de estilo opinable: es el contrato. Lo que aquí tiene un número
se verifica automáticamente en el build. Lo que no, se verifica en revisión de código.

---

## 1. Límites duros

Verificados por Checkstyle y PMD. El build falla si se superan.

| Métrica | Límite | Por qué |
|---|---|---|
| Líneas del cuerpo de un método | 20 | Si no cabe en pantalla, hace más de una cosa |
| Líneas de una clase | 200 | Por encima de eso hay una responsabilidad escondida |
| Líneas de un archivo | 400 | Aplica también a `.ts` y `.scss` |
| Parámetros de un método | 4 | Con más, se pasa un objeto de parámetros |
| Niveles de anidamiento | 2 | El tercer `if` dentro de un `for` es una función nueva |
| Complejidad ciclomática | 10 | Medida por PMD |
| Métodos públicos por clase | 10 | Señal de clase que acumula responsabilidades |
| Profundidad de herencia | 2 | Se prefiere composición |

**Excepción única:** clases de configuración y mapeadores generados. Se marcan explícitamente
y quedan excluidas también de la cobertura.

---

## 2. SOLID aplicado a este proyecto

No se cita el principio: se muestra dónde aparece aquí.

### S — Responsabilidad única

Un `PagoServicio` que valida el monto, llama a la pasarela, escribe `acceso_recurso`, manda
el correo de confirmación y emite la factura tiene cinco razones para cambiar. Se separa:

```
ProcesarPagoCasoUso        → orquesta el flujo
PasarelaPagoPuerto         → habla con Wompi/MercadoPago
OtorgarAccesoCasoUso       → escribe acceso_recurso
NotificadorPuerto          → correo
```

**Prueba práctica:** si al describir una clase usas la palabra «y», sobra algo.

### O — Abierto/cerrado

La pasarela de pago está sin decidir (pendiente #1). El dominio depende de
`PasarelaPagoPuerto`; agregar Mercado Pago junto a Wompi crea un adaptador nuevo y **no toca
una sola línea del dominio**. Lo mismo aplica al proveedor de video y al de correo.

### L — Sustitución de Liskov

Toda implementación de un puerto respeta el mismo contrato observable. Si
`WompiAdaptador.cobrar()` devuelve un resultado fallido cuando la tarjeta es rechazada,
`MercadoPagoAdaptador.cobrar()` no puede lanzar una excepción en el mismo caso. El contrato
—incluidos errores y valores vacíos— se documenta en el puerto y se prueba con la misma
batería de tests para todas las implementaciones.

### I — Segregación de interfaces

Nada de un `RepositorioGenerico<T>` con veinte métodos que ninguna implementación cumple del
todo. Los puertos se definen **por lo que el dominio necesita**, no por lo que la tecnología
ofrece:

```java
public interface UsuarioRepositorioPuerto {
    Optional<Usuario> buscarPorCorreo(String correo);
    Usuario guardar(Usuario usuario);
}
```

Si el módulo de reportes necesita consultas de agregación pesadas, ese es **otro** puerto
(`ReporteConsultaPuerto`), no tres métodos más aquí.

### D — Inversión de dependencias

El dominio **declara** las interfaces; la infraestructura las implementa. La flecha de
dependencia siempre apunta hacia adentro. Esto lo verifica ArchUnit, no la buena voluntad.

---

## 3. Código limpio

### Reglas que no admiten discusión

1. **Ningún número ni texto mágico.** Todo valor de negocio es configuración o constante con
   nombre. `if (intentos > 3)` está prohibido; `if (intentos > limiteIntentos)` es lo correcto.
2. **Un solo nivel de abstracción por método.** Un método no mezcla orquestación con detalle:
   o llama a tres pasos con nombre, o hace un cálculo.
3. **Retorno temprano.** Se validan las condiciones de salida al principio y se evita el `else`.
4. **Inmutabilidad por defecto.** `final` en campos y variables locales. `record` para todo lo
   que solo transporta datos.
5. **Sin efectos secundarios ocultos.** Un método que se llama `calcularProgreso` no guarda nada.
6. **Nada de banderas booleanas como parámetro.** `emitir(true)` no significa nada; se hacen
   dos métodos con nombre.
7. **Sin código comentado.** Para eso está el historial de Git. Se borra.
8. **Sin `TODO` huérfanos.** Un `TODO` sin número de tarea asociado no entra al repositorio.

### Objetos de valor en vez de tipos primitivos

Los conceptos con reglas propias no se representan con `String` ni `int`:

```java
// Correo del usuario. Se normaliza a minúsculas al construirse porque la unificación
// de cuentas depende de que el mismo correo produzca siempre la misma clave.
public record Correo(String valor) {
    public Correo {
        Objects.requireNonNull(valor, "El correo es obligatorio");
        valor = valor.trim().toLowerCase(Locale.ROOT);
        if (!PATRON.matcher(valor).matches()) {
            throw new CorreoInvalidoExcepcion(valor);
        }
    }
}
```

Candidatos obligatorios en este proyecto: `Correo`, `Dinero`, `CodigoCertificado`,
`Slug`, `MarcaTiempoMs`, `DireccionFuelle`, `Afinacion`.

Esto elimina de raíz el error de pasar un `String` donde iba otro, que es el fallo más común
del código generado.

---

## 4. Nomenclatura

### Idioma

**Todo el código se nombra en español.** Lo único que permanece en inglés es lo que no nos
pertenece: anotaciones y APIs del framework (`@RestController`, `ngOnInit`, `Optional.map`).

### Sin tildes ni eñes en identificadores

Es una **regla técnica, no estética**. Una `ñ` o una tilde en un nombre de clase, método,
columna o archivo produce fallos intermitentes de codificación entre el contenedor, el driver
de PostgreSQL y las herramientas de terceros; y son fallos dificilísimos de diagnosticar
porque solo aparecen en algunos entornos.

| Palabra | Se escribe |
|---|---|
| año | `anio` |
| contraseña | `contrasena` |
| diseño | `disenio` |
| tamaño | `tamanio` |
| número | `numero` |
| código | `codigo` |
| día | `dia` |
| envío | `envio` |
| cálculo | `calculo` |
| revisión | `revision` |
| español | `espaniol` |

**Los comentarios y la documentación sí llevan tildes y eñes**, en español correcto. Todos los
archivos son UTF-8 (`project.build.sourceEncoding` en el `pom.xml`).

### Formato por tipo de elemento

| Elemento | Formato | Ejemplo |
|---|---|---|
| Clase, interfaz, record | `PascalCase` | `AccesoRecurso`, `IntentoExamen` |
| Método, variable, campo | `camelCase` | `calcularProgresoNivel`, `fechaVencimiento` |
| Constante | `UPPER_SNAKE_CASE` | `PESO_TEORIA_POR_DEFECTO` |
| Paquete Java | minúsculas, sin separadores | `com.academiadiegoromero.catalogo.dominio` |
| Tabla y columna | `snake_case` | `acceso_recurso`, `vence_en` |
| Campo JSON de la API | `camelCase` | `venceEn`, `nivelActual` |
| Archivo Angular | `kebab-case` | `mis-cursos.component.ts` |
| Selector de componente | `adr-` + kebab | `<adr-tarjeta-curso>` |
| Variable CSS | `--adr-` + kebab | `--adr-color-azul-rey` |
| Rama de Git | `tipo/modulo-descripcion` | `feat/pagos-webhook-wompi` |

### Verbos con significado fijo

Un prefijo significa siempre lo mismo. Sin excepciones:

| Prefijo | Contrato |
|---|---|
| `buscar…` | Devuelve `Optional`. La ausencia es normal |
| `obtener…` | Devuelve el objeto o lanza excepción. La ausencia es un error |
| `listar…` | Devuelve colección, vacía si no hay. **Nunca `null`** |
| `contar…` | Devuelve `long` |
| `existe…` | Devuelve `boolean` |
| `crear…` | Construye y persiste algo nuevo |
| `registrar…` | Crea con reglas de negocio de por medio |
| `actualizar…` | Modifica algo existente |
| `anular…` | Baja lógica. **Nunca borrado físico** |
| `calcular…` | Puro, sin efectos secundarios, sin persistir |
| `validar…` | Lanza excepción si no cumple; no devuelve nada |
| `emitir…` / `aprobar…` / `rechazar…` | Transición de estado del dominio |

### Booleanos

Siempre con prefijo, siempre en afirmativo. `estaVigente`, `tieneAccesoPermanente`,
`puedeDescargar`, `esCertificable`, `hayStockDisponible`.

Prohibido el negativo: `noEstaVigente` produce `if (!noEstaVigente)`, que nadie lee bien.

### Sufijos de clase

`…Puerto` · `…Adaptador` · `…Repositorio` · `…Servicio` · `…CasoUso` · `…Controlador` ·
`…Dto` · `…Solicitud` · `…Respuesta` · `…Mapeador` · `…Validador` · `…Configuracion` ·
`…Excepcion` · `…Evento` · `…Entidad` (solo persistencia JPA).

Un sufijo declara la capa a la que pertenece la clase. Una clase con sufijo `Adaptador` dentro
del paquete `dominio` es un error que ArchUnit rechaza.

---

## 5. Comentarios

**Regla 8: cada método público lleva un comentario de una a tres líneas justo encima.**

El comentario explica **por qué existe el método y qué regla de negocio protege**. Nunca lo
que se ve leyendo el código.

```java
// Un nivel solo se desbloquea si el examen del nivel anterior fue aprobado. Se valida aquí
// y no en el front porque ocultar el botón no es control de acceso (no negociable #4).
public boolean puedeAccederANivel(Inscripcion inscripcion, Nivel nivel) {
```

```java
// MAL: repite la firma, no aporta nada.
// Obtiene el usuario por id.
public Usuario obtenerUsuarioPorId(Long id) {
```

**Dentro del cuerpo solo se comenta lo que sorprende**: una decisión contraintuitiva, un
límite de un proveedor externo, una consecuencia legal. Si el código necesita explicación
línea a línea, el problema es el código.

**Javadoc completo** solo en los puertos del dominio: son el contrato que otros implementan,
y ahí sí importan los parámetros, el retorno y las excepciones.

---

## 6. Cómo se evita el espagueti

El código espagueti no nace de golpe: nace de una capa que hace el trabajo de otra. Estas son
las fronteras, y ArchUnit las verifica en cada build (ver `docs/02-arquitectura.md §5`).

| Capa | Puede | No puede |
|---|---|---|
| **Controlador** | Traducir HTTP ↔ caso de uso, validar formato de entrada | Contener `if` de negocio, tocar el repositorio, conocer JPA |
| **Caso de uso** | Orquestar pasos, abrir transacción, coordinar puertos | Calcular reglas de negocio, conocer HTTP o SQL |
| **Dominio** | Todas las reglas y cálculos del negocio | Importar Spring, JPA, Jackson o cualquier infraestructura |
| **Adaptador** | Hablar con BD, pasarelas, correo, almacenamiento | Decidir nada de negocio |

**Prohibiciones específicas:**

- Entidades JPA cruzando la frontera de un módulo. Entre módulos se intercambian DTOs o eventos.
- Ciclos de dependencia entre módulos. Si `pagos` y `catalogo` se necesitan mutuamente, falta
  un evento de dominio.
- `@Autowired` sobre campos. **Siempre inyección por constructor** — hace visible el exceso de
  dependencias y permite instanciar la clase en un test sin Spring.
- Estado mutable compartido entre peticiones.
- Consultas SQL fuera de la capa de persistencia.

---

## 7. Java 21 — uso obligatorio

| Recurso | Dónde se usa |
|---|---|
| `record` | Todo DTO, comando, evento y objeto de valor |
| `sealed interface` + `switch` exhaustivo | Estados de negocio: `EstadoIntentoExamen`, `EstadoPedido`, `ResultadoPago` |
| Virtual threads | `spring.threads.virtual.enabled=true` |
| `Optional` | Retorno de consultas que pueden no encontrar nada |
| Pattern matching | En vez de cadenas de `instanceof` |

Las `sealed interface` son la defensa más valiosa del proyecto: cuando se agregue un estado
nuevo, **todo lugar que no lo contemple deja de compilar**. Es una red que atrapa el olvido
en archivos que nadie estaba mirando.

**Prohibido:** `null` como valor de retorno público · excepciones vacías · `var` cuando el
tipo no es evidente en la misma línea · herencia para reutilizar código.

---

## 8. TypeScript y Angular 18

- `strict: true` y `strictTemplates: true`. **`any` está prohibido**; si no se conoce el tipo,
  se usa `unknown` y se estrecha.
- **Standalone components** siempre. Sin `NgModule` nuevos.
- `changeDetection: ChangeDetectionStrategy.OnPush` en todos los componentes.
- **Signals** para estado local; RxJS solo para flujos asíncronos reales (HTTP, eventos).
- Los modelos son `interface`, no `class`.
- **Cero lógica en las plantillas.** Sin llamadas a métodos en interpolaciones: se calcula en
  un `computed()`.
- Un componente que supera 150 líneas de plantilla se parte.
- La comunicación HTTP vive en servicios, nunca en un componente.
- Los tipos de la API se declaran una sola vez en `frontend/src/app/nucleo/modelos/` y se
  mantienen alineados con los DTOs del backend en el mismo commit.

---

## 9. Errores

- Excepciones propias por dominio, heredando de una base por módulo:
  `PagoExcepcion`, `AccesoDenegadoExcepcion`, `NivelBloqueadoExcepcion`.
- `Optional` para la ausencia esperada; excepción solo para violación de una invariante.
- Un único `@RestControllerAdvice` traduce excepciones de dominio a códigos HTTP.
- Respuesta de error normalizada con **Problem Details (RFC 7807)**, siempre con el mismo
  cuerpo: `tipo`, `titulo`, `estado`, `detalle`, `instancia`, `codigoError`.
- **Nunca** se filtra al cliente el mensaje de una excepción de infraestructura: puede revelar
  estructura interna, nombres de tablas o rutas.
- `catch` vacío prohibido. Si algo se ignora deliberadamente, se registra y se comenta por qué.

---

## 10. Registro de eventos (logs)

- SLF4J. `System.out.println` está prohibido y lo bloquea el linter.
- Formato JSON estructurado en producción, para que Cloud Logging lo indexe.
- Un `idCorrelacion` por petición, propagado a todos los logs de esa petición.
- **Nunca se registran:** contraseñas, tokens, refresh tokens, número de documento completo,
  datos de tarjeta, ni el payload crudo de la pasarela.
- Niveles: `ERROR` solo si requiere intervención humana · `WARN` para degradación ·
  `INFO` para hitos de negocio (pago confirmado, certificado emitido) · `DEBUG` para desarrollo.

---

## 11. Herramientas que aplican esto

| Herramienta | Ámbito | Efecto |
|---|---|---|
| Checkstyle | Java | Formato, nombres, límites de tamaño |
| PMD | Java | Complejidad, código muerto, malas prácticas |
| SpotBugs | Java | Errores probables en bytecode |
| ArchUnit | Java | Fronteras de arquitectura (§6) |
| JaCoCo | Java | Cobertura ≥ 80%, rompe el build |
| ESLint + Prettier | TypeScript | Formato y reglas de estilo |
| EditorConfig | Todo | Fin de línea LF, UTF-8, indentación |

Todas corren en `./mvnw verify` y en CI. **Ninguna se salta con un comentario de supresión**
sin justificación escrita en el mismo archivo.
