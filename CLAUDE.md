# Academia Diego Romero — Contexto operativo

Plataforma web de formación musical en línea (acordeón vallenato) sobre la marca personal de
Diego Romero. Suscripción a cursos por niveles + venta suelta + tienda. Diferenciador: simulador
de pisadas sincronizado con video.

**Este archivo se carga en cada sesión.** Es el resumen ejecutable de las reglas del proyecto.
El detalle completo vive en `docs/`. Si algo aquí contradice a `docs/`, gana `docs/` y hay que
corregir este archivo.

---

## Fuentes de verdad

| Qué | Dónde |
|---|---|
| Requisitos, modelo de datos, reglas de negocio | `docs/especificacion-maestra.md` |
| Estado actual, glosario, decisiones pendientes | `docs/00-contexto.md` |
| Cómo se escribe el código | `docs/01-estandares-codigo.md` |
| Dónde va cada archivo | `docs/02-arquitectura.md` |
| Qué es configurable y cómo | `docs/03-configuracion.md` |
| Componentes, tokens visuales, iconos | `docs/04-frontend-y-componentes.md` |
| Qué y cómo se prueba | `docs/05-testing.md` |
| Ciberseguridad | `docs/06-seguridad.md` |
| Git, PRs, documentación de procesos | `docs/07-proceso.md` |
| Decisiones técnicas y su porqué | `docs/adr/` |

---

## Stack fijado

| Capa | Tecnología |
|---|---|
| Backend | Java 21 + **Spring Boot 4.1** + Maven |
| Base de datos | PostgreSQL — migraciones SQL manuales versionadas (sin Flyway ni Liquibase) |
| Frontend | **Angular 21** — standalone, signals, zoneless, TypeScript `strict` |
| Pruebas | JUnit 5 + Testcontainers (backend) · **Vitest** (frontend) |
| Arquitectura | Monolito modular + hexagonal (puertos y adaptadores) |
| Repositorio | Monorepo: `backend/`, `frontend/`, `docs/` |
| Iconos | **Material Symbols Rounded**, peso 400, SVG inline con `currentColor` |
| Sistema visual | «Azul rey» — tokens en `frontend/src/app/disenio/_tokens.scss` |

Razonamiento en `docs/adr/0001-stack-tecnologico.md`. Las versiones se corrigieron en
`docs/adr/0006-versiones-vigentes-framework.md`: Spring Boot 3 y Angular 18 están fuera de
soporte y no reciben parches de seguridad.

---

## Las reglas del proyecto

1. **SOLID** en cada clase. Ver `docs/01-estandares-codigo.md §2`.
2. **Código limpio**: funciones cortas, un solo nivel de abstracción, sin números mágicos.
3. **Sin código espagueti**: la arquitectura hexagonal se valida con ArchUnit en el build.
4. **Todo paramétrico**: ningún valor de negocio escrito en el código.
5. **Todo configurable**: por variables de entorno con validación al arrancar.
6. **Todo modular**: paquetes por dominio, no por capa técnica.
7. **Nomenclatura en español, sin tildes ni ñ**, camelCase. Ver `docs/01-estandares-codigo.md §4`.
8. **Un comentario al inicio de cada método público**, explicando el porqué, no el cómo.
9. **Estrategias profesionales**: patrones conocidos y justificados, nunca invención propia.
10. **Cobertura de tests ≥ 80%**, verificada por JaCoCo — el build falla por debajo.
11. **Componentes estandarizados**: paneles, modales y tarjetas salen del catálogo compartido.
12. **Iconos Material Symbols Rounded** (Google). Sin emojis, sin iconos sueltos de otras librerías.
13. **Pensado para escala**: 1000 alumnos concurrentes como línea base de diseño.
14. **Todo proceso queda documentado** al terminarlo, no después.
15. **Paleta y tipografía ya definidas** — se usan tokens, nunca valores literales.
16. **Ciberseguridad por diseño**: validar en cada capa, nunca confiar en el front.

---

## No negociables

Estas ocho reglas nacen del negocio y romper cualquiera cuesta dinero o clientes.
No se relajan «temporalmente».

1. **Un correo = una cuenta.** Cualquier método de ingreso (Google, Facebook, correo) resuelve
   siempre al mismo `Usuario`. Las cuentas duplicadas son el reclamo de soporte más caro.
2. **El acceso vive en una sola tabla.** Suscripción y compra suelta escriben ambas en
   `acceso_recurso`. Nunca se pregunta «¿pagó?» en dos lugares con lógicas distintas.
3. **El webhook de la pasarela es la única fuente de verdad del pago.** Jamás se habilita
   acceso desde el frontend ni desde una redirección de retorno.
4. **El desbloqueo de nivel se valida en el backend.** Ocultar el botón en el front no es
   control de acceso.
5. **La suscripción da acceso temporal; la compra suelta, permanente.** Al vencer, el alumno
   conserva para siempre lo comprado, sus certificados y su historial de progreso.
6. **El progreso es por inscripción (curso), no por usuario.** Un alumno puede ir en nivel 1
   de acordeón y nivel 2 de guitarra a la vez.
7. **Se valida stock antes de cobrar.** Vender lo que no existe es el error más caro de la tienda.
8. **Ningún secreto en el código ni en el repositorio.** Variables de entorno y Secret Manager.

---

## Reglas de trabajo con IA

Este proyecto se construye con asistencia de Claude. Eso obliga a disciplina adicional:

- **Leer antes de escribir.** Antes de crear un archivo, revisar si ya existe algo equivalente
  en el módulo. La duplicación silenciosa es el modo de falla principal aquí.
- **Un cambio, un módulo.** Si un cambio toca tres dominios, casi siempre está mal ubicado.
- **No inventar convenciones.** Si algo no está en `docs/`, se pregunta o se propone un ADR —
  no se decide sobre la marcha y se olvida en la siguiente sesión.
- **Los tests son la revisión.** Código nuevo sin test no está terminado.
- **Actualizar la documentación en el mismo commit** que el código que la vuelve obsoleta.

---

## Comandos

Requisitos: **JDK 21**, **Node 20+** y **Docker** (para PostgreSQL local y Testcontainers).
Maven no hace falta: `mvnw` se descarga solo.

```bash
docker compose up -d
```

```bash
cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

```bash
cd backend && ./mvnw verify
```

`verify` corre pruebas, cobertura (falla bajo 80%), ArchUnit, Checkstyle, PMD y SpotBugs.

```bash
cd frontend && npm start
```

```bash
cd frontend && npm test
```

`npm test` incluye cobertura y falla bajo el umbral. `npm run lint` para el linter y
`npm run iconos:generar` para regenerar el registro de iconos Material Symbols.

---

## Checklist antes de dar por terminado un cambio

- [ ] `./mvnw verify` pasa (incluye cobertura ≥ 80% y reglas de ArchUnit)
- [ ] Ningún valor de negocio quedó escrito en el código (regla 4)
- [ ] Cada método público nuevo tiene su comentario de intención (regla 8)
- [ ] Nombres en español sin tildes ni ñ (regla 7)
- [ ] Autorización validada en backend, no solo en el front (regla 16)
- [ ] Documentación del proceso actualizada (regla 14)
- [ ] Si se tomó una decisión técnica de fondo, hay un ADR nuevo en `docs/adr/`
