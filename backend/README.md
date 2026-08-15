# Backend — Academia Diego Romero

Java 21 · Spring Boot 4.1 · Maven · PostgreSQL
Arquitectura hexagonal modular ([docs/02](../docs/02-arquitectura.md)).

---

## ⚠ Estado: sin compilar todavía

**Este andamiaje se escribió en una máquina sin JDK instalado, así que no ha pasado por el
compilador.** La estructura, las reglas y la configuración están completas y revisadas, pero
la primera ejecución de `./mvnw verify` puede sacar ajustes —una versión de plugin, una firma
de API de Spring Security 7—. Es lo esperable, no un fallo del diseño.

**Lo primero que hay que hacer** es instalar un JDK 21 y ejecutar:

```bash
cd backend && ./mvnw verify
```

Maven **no** hace falta instalarlo: el wrapper (`mvnw`) se descarga solo.

Puntos con más probabilidad de necesitar retoque, por orden:

1. El DSL de `SeguridadHttpConfiguracion` (Spring Security 7 cambió algunas firmas).
2. Las versiones de los plugins de calidad en `pom.xml`.
3. Las reglas de `config/checkstyle.xml`, fijadas contra Checkstyle 10.26.1.

---

## Requisitos

| Herramienta | Versión | Para qué |
|---|---|---|
| JDK | 21 | Compilar y ejecutar |
| Docker | cualquiera reciente | PostgreSQL local y Testcontainers |

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

1. `./mvnw verify` y corregir lo que salga.
2. Decidir el registro de migraciones —ver
   [`db/migracion/LEEME.md`](src/main/resources/db/migracion/LEEME.md), hay una
   recomendación ahí.
3. Clase base de pruebas de integración con Testcontainers, que aplique las migraciones.
4. Prueba de arranque del contexto de Spring: hoy nada verifica que el cableado funcione,
   porque necesita base de datos.
5. Módulo `identidad`, empezando por la unificación de cuentas (no negociable #1).
