# Backend — Academia Diego Romero

Java 21 · Spring Boot 4.1 · Maven · PostgreSQL
Arquitectura hexagonal modular ([docs/02](../docs/02-arquitectura.md)).

---

## Estado: verificado

`mvn verify` pasa en verde: **41 pruebas, 0 fallos**, cobertura 100% sobre las clases no
excluidas, y las cinco puertas de calidad ejecutándose de verdad —JaCoCo, ArchUnit, Checkstyle,
PMD y SpotBugs—. La imagen de Docker arranca y responde `UP` en `/actuator/health` conectada a
PostgreSQL.

Dos ajustes hicieron falta en la primera compilación, ambos documentados en el código:

1. **Checkstyle excluye `AcademiaAplicacion.java`.** Como solo tiene un `main` estático,
   `HideUtilityClassConstructor` la toma por clase de utilidad y exige constructor privado. No
   se le puede poner: `@SpringBootApplication` implica `@Configuration` y Spring necesita
   instanciarla para su proxy.
2. **Cuatro reglas de ArchUnit llevan `allowEmptyShould(true)`.** Todavía no existe ninguna
   clase `Controlador`, `Adaptador` ni `Puerto`, y ArchUnit falla por defecto cuando una regla
   no encuentra nada que revisar. **Hay que quitar esos `allowEmptyShould` en cuanto el primer
   módulo tenga sus clases**: a partir de ahí, que una regla no encuentre nada sí es señal de
   que algo se movió de sitio.

---

## Requisitos

| Herramienta | Versión | Para qué |
|---|---|---|
| JDK | 21 | Compilar y ejecutar |
| Docker | cualquiera reciente | PostgreSQL local y Testcontainers |

Maven **no** hace falta instalarlo: el wrapper (`mvnw`) se descarga solo.

**Sin JDK local** se puede compilar dentro de un contenedor. Importa el `--user`: sin él, el
contenedor escribe `target/` como root y después no se puede borrar sin privilegios.

```bash
docker run --rm --user "$(id -u):$(id -g)" -v "$PWD":/app -w /app maven:3.9-eclipse-temurin-21 mvn -B verify
```

---

## Comandos

Levantar PostgreSQL (desde la raíz del repositorio):

```bash
docker compose up -d
```

Arrancar la aplicación en local:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

Verificación completa — pruebas, cobertura, ArchUnit, Checkstyle, PMD y SpotBugs:

```bash
./mvnw verify
```

Una prueba concreta:

```bash
./mvnw test -Dtest=CorreoTest
```

Pruebas de mutación sobre el dominio (lentas, semanales):

```bash
./mvnw -Pmutacion test
```

---

## Qué hace fallar el build

Estas puertas son deliberadas. Ninguna se baja «temporalmente» (docs/07 §7):

| Puerta | Umbral |
|---|---|
| JaCoCo | 80% de líneas y 75% de ramas, global **y** por paquete de dominio |
| ArchUnit | Las 12 reglas de frontera de `ReglasArquitecturaTest` |
| Checkstyle | Nombres, límites de tamaño y números mágicos |
| PMD | Complejidad, código muerto, seguridad, duplicación |
| SpotBugs | Errores probables sobre el bytecode |

---

## Estructura

```
src/main/java/com/academiadiegoromero/
├── AcademiaAplicacion.java
├── configuracion/          cableado transversal (excluido de cobertura)
├── compartido/             objetos de valor sin dueño claro — debe seguir diminuto
└── <modulo>/               identidad · catalogo · aprendizaje · contenido · acceso ·
    ├── dominio/            pagos · evaluacion · practica · comercio · notificacion ·
    │   ├── modelo/         administracion
    │   ├── puerto/
    │   ├── servicio/
    │   └── excepcion/
    ├── aplicacion/
    │   ├── casouso/
    │   └── dto/
    └── infraestructura/
        ├── web/
        ├── persistencia/
        └── cliente/
```

`identidad/` tiene el esqueleto de capas completo como referencia copiable. Los demás módulos
tienen solo su `package-info.java`: las capas se crean cuando llega su trabajo, para no dejar
carpetas vacías que nadie sabe si están en uso.

---

## Lo primero de la fase 1

1. Decidir el registro de migraciones —ver
   [`db/migracion/LEEME.md`](src/main/resources/db/migracion/LEEME.md), hay una
   recomendación ahí.
2. Clase base de pruebas de integración con Testcontainers, que aplique las migraciones.
3. Prueba de arranque del contexto de Spring. El contenedor ya arranca y responde `UP`, así
   que el cableado funciona; pero eso se comprueba a mano y solo al desplegar. Hace falta un
   test que lo verifique en cada build, y necesita base de datos.
4. Módulo `identidad`, empezando por la unificación de cuentas (no negociable #1).
