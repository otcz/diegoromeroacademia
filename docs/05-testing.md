# 05 · Estrategia de pruebas

**Cubre la regla 10 del proyecto: cobertura mínima del 80%.**

> El 80% no es una meta que se persigue al final. Es un umbral que **rompe el build** desde el
> primer commit. Perseguirlo después significa escribir tests para subir un número, que es
> exactamente el tipo de test que no sirve para nada.

---

## 1. Pirámide

| Nivel | Proporción | Qué prueba | Velocidad |
|---|---|---|---|
| **Unitarias** | ~70% | Dominio puro: reglas, cálculos, invariantes. Sin Spring, sin BD | milisegundos |
| **Integración** | ~25% | Adaptadores, repositorios, controladores, migraciones. PostgreSQL real vía Testcontainers | segundos |
| **Extremo a extremo** | ~5% | Recorridos críticos completos en navegador | minutos |

La razón de esta forma: los tests del dominio son los que atrapan errores de lógica y corren
en segundos, así que se ejecutan constantemente. Si la mayoría del esfuerzo está en E2E, la
suite se vuelve lenta, se deja de correr, y deja de servir.

**Que el dominio no dependa de Spring (`docs/02 §5`) es lo que hace posible esta pirámide.**
Las dos reglas se sostienen mutuamente.

---

## 2. El umbral del 80%

### Configuración de JaCoCo

```xml
<!-- Rompe el build si la cobertura baja del umbral. El objetivo es que la regla 10 se
     cumpla sola: nadie tiene que acordarse de revisarla. -->
<limit>
    <counter>LINE</counter>
    <value>COVEREDRATIO</value>
    <minimum>0.80</minimum>
</limit>
<limit>
    <counter>BRANCH</counter>
    <value>COVEREDRATIO</value>
    <minimum>0.75</minimum>
</limit>
```

**Se miden líneas y ramas.** Solo líneas es engañoso: un `if` con cinco condiciones puede
tener el 100% de líneas cubiertas y no haber probado ni una sola combinación real.

### El umbral se aplica por módulo, no solo global

Regla clave: **80% global + 80% en cada paquete `..dominio..`**. Un promedio global del 80%
puede esconder un módulo `pagos` al 30% compensado por DTOs triviales al 100% — justamente el
módulo donde un error cuesta dinero.

### Exclusiones — la lista completa

Solo estas. Cualquier exclusión nueva requiere justificación escrita en el `pom.xml`:

| Excluido | Por qué |
|---|---|
| `**/AcademiaAplicacion.class` | Punto de arranque, sin lógica |
| `**/configuracion/**` | Cableado declarativo |
| `**/dto/**`, `**/*Dto.class` | `record` sin comportamiento |
| `**/persistencia/entidad/**` | Entidades JPA, solo estructura |
| `**/*Mapeador*.class` | Generados por MapStruct |

**Nunca se excluye** un paquete `dominio`, `casouso`, `servicio` ni `adaptador`. Excluir lo
difícil de probar convierte el 80% en una cifra decorativa.

---

## 3. Cómo se escribe un test

### Nomenclatura

En español, describiendo **la regla de negocio**, no el método:

```java
// BIEN — se entiende qué se rompió con solo leer el nombre del test que falló
void debeNegarAccesoALaClaseCuandoLaSuscripcionVencio()
void debeConservarElAccesoAlTutorialCompradoAunqueVenzaLaSuscripcion()
void debeResolverAlMismoUsuarioCuandoIngresaConGoogleYConCorreo()

// MAL — no dice nada cuando falla en CI a las 11 de la noche
void testAcceso1()
void obtenerAccesoTest()
```

### Estructura

Tres bloques separados por una línea en blanco, siempre en el mismo orden:

```java
@Test
void debeConservarElAccesoAlTutorialCompradoAunqueVenzaLaSuscripcion() {
    // Dado
    var usuario = UsuarioPrueba.conSuscripcionVencida();
    var acceso = AccesoRecursoPrueba.compraPermanente(TUTORIAL_LA_GOTA_FRIA);

    // Cuando
    var puedeVer = servicioAcceso.puedeAcceder(usuario, TUTORIAL_LA_GOTA_FRIA);

    // Entonces
    assertThat(puedeVer).isTrue();
}
```

### Reglas

1. **Un concepto por test.** Varias aserciones están bien si verifican la misma regla.
2. **Sin lógica en los tests.** Un `if` o un `for` dentro de un test significa que hay dos
   tests mezclados. Para varios casos se usa `@ParameterizedTest`.
3. **Constructores de datos de prueba** (`UsuarioPrueba`, `CursoPrueba`) en vez de repetir
   veinte líneas de armado. Viven en `src/test/java/…/prueba/`.
4. **No se hacen mocks de lo que no nos pertenece.** No se mockea el SDK de la pasarela: se
   mockea `PasarelaPagoPuerto`, que sí es nuestro. Un mock de una librería externa prueba
   nuestra idea de cómo funciona, no cómo funciona.
5. **Sin dependencia de orden.** Cada test se prepara y limpia solo.
6. **Sin esperas fijas.** `Thread.sleep` está prohibido; se usa Awaitility.
7. **Fechas inyectadas.** El dominio recibe un `Clock`, nunca llama a `LocalDateTime.now()`.
   Sin esto, las suscripciones son imposibles de probar de forma determinista.

---

## 4. Lo que obligatoriamente tiene test

Los ocho no negociables de `CLAUDE.md` **tienen cada uno un test con nombre explícito**. Si
alguno se rompe, el build cae. No hay excepción:

| # | Regla | Test |
|---|---|---|
| 1 | Un correo = una cuenta | `debeResolverAlMismoUsuarioCuandoIngresaConGoogleYConCorreo` |
| 2 | El acceso vive en una sola tabla | `debeOtorgarAccesoDesdeSuscripcionYDesdeCompraEnLaMismaTabla` |
| 3 | El webhook es la única fuente de verdad | `debeIgnorarLaConfirmacionDePagoQueNoVieneDelWebhook` |
| 4 | Desbloqueo validado en backend | `debeRechazarLaPeticionAlNivelBloqueadoAunqueElFrontLaEnvie` |
| 5 | Suscripción temporal, compra permanente | `debeConservarElAccesoAlTutorialCompradoAunqueVenzaLaSuscripcion` |
| 6 | Progreso por inscripción | `debeLlevarProgresoIndependientePorCursoDelMismoUsuario` |
| 7 | Stock validado antes de cobrar | `debeRechazarElPedidoCuandoNoHayStockAntesDeCobrar` |
| 8 | Sin secretos en el código | `gitleaks` en pre-commit y en CI |

Además, con test obligatorio: idempotencia del webhook (procesar dos veces el mismo pago no
duplica el acceso), expiración de URL firmada de video, límite de dispositivos simultáneos, y
cálculo de nota del examen con los pesos configurados.

---

## 5. Tests de integración

- **PostgreSQL real con Testcontainers.** H2 está prohibido: acepta SQL que PostgreSQL
  rechaza, y el error aparece en producción en vez de en el test.
- Un contenedor compartido por ejecución (`@Container static`), no uno por clase.
- **Las migraciones se prueban:** el contenedor arranca aplicando `db/migracion/` en orden.
  Una migración que no corre en limpio es un despliegue caído.
- **Se cuentan las consultas** en los endpoints de listado para atrapar el problema N+1 antes
  de que llegue a producción con 1000 alumnos (regla 13).
- Los adaptadores externos (pasarela, video, correo) se prueban contra un servidor simulado
  (WireMock), no contra el servicio real.

---

## 6. Frontend

| Aspecto | Herramienta / regla |
|---|---|
| Motor | **Vitest** con `TestBed` — es el corredor por defecto de Angular 21 |
| Comando | `npm test` (ya incluye cobertura y rompe si baja del umbral) |
| Cobertura | **80% líneas, sentencias y funciones · 75% ramas**, igual que el backend |
| Enfoque | Se prueba lo que ve el usuario: roles ARIA, textos y etiquetas |
| Servicios | HTTP simulado con `HttpTestingController` |
| Componentes del catálogo | Cada uno con test de sus variantes y estados (§4 de `docs/04`) |

**Selección de elementos:** se prefieren el rol ARIA y el texto visible
(`[role="progressbar"]`, `[role="dialog"]`) sobre las clases CSS. Un cambio de estilo no
puede romper un test. Cuando no hay rol aplicable —una clase de modificador visual—, se
permite la clase, pero nunca la posición dentro del DOM.

**Nota sobre `no-call-expression`:** esa regla de lint queda desactivada a propósito. En
Angular moderno leer un signal es sintácticamente una llamada, así que marcaría cada
`nombre()` de cada plantilla. El principio de docs/01 §8 —cero lógica en plantillas, lo
calculado va en un `computed()`— sigue vigente y se verifica en revisión.

---

## 7. Extremo a extremo

Playwright, solo sobre los recorridos donde un fallo cuesta dinero:

1. Registro con correo → onboarding → selección de plan → pago → acceso otorgado.
2. Ingreso con Google usando un correo ya registrado → **cae en la misma cuenta**.
3. Reproducir una clase con suscripción vigente → funciona; con suscripción vencida → se niega.
4. Aprobar examen → siguiente nivel se desbloquea → certificado emitido y verificable.
5. Comprar producto físico sin stock → se rechaza antes de cobrar.

Corren contra un ambiente desplegado, con datos sembrados, nunca contra producción.

---

## 8. Pruebas de mutación

Para el paquete `dominio` se ejecuta **PIT** semanalmente (no en cada commit, es lento).

Motivo: la cobertura mide qué líneas se ejecutan, no si el test las **verifica**. Un test que
ejecuta un método sin comprobar el resultado da 100% de cobertura y no protege nada. Las
pruebas de mutación alteran el código a propósito y comprueban que algún test falle. Es la
única forma real de saber si el 80% significa algo. Meta: **≥70% de mutantes eliminados en el
dominio.**

---

## 9. Qué se ejecuta y cuándo

| Momento | Qué corre |
|---|---|
| Pre-commit | Linter, formato, `gitleaks` |
| `./mvnw verify` | Unitarias + integración + cobertura + ArchUnit + Checkstyle + PMD |
| Pull request | Todo lo anterior + tests y cobertura del frontend |
| Fusión a `main` | Todo lo anterior + E2E sobre el ambiente de pruebas |
| Semanal | Pruebas de mutación + auditoría de dependencias |

**Un pull request con el build en rojo no se fusiona.** No existe el «lo arreglo después».
