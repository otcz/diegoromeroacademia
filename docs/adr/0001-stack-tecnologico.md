# ADR 0001 · Stack tecnológico

**Estado:** aceptado · **versiones corregidas por [ADR 0006](0006-versiones-vigentes-framework.md)**
**Fecha:** 2026-08-14
**Deciden:** Oscar Tomás Carrillo Zuleta

> **Nota:** la elección de plataforma de este ADR sigue vigente. Las **versiones** no:
> Spring Boot 3 y Angular 18 resultaron estar fuera de soporte, y se corrigieron a
> **Spring Boot 4.1 y Angular 21** en el [ADR 0006](0006-versiones-vigentes-framework.md).
> El razonamiento de abajo se conserva tal como se escribió.

---

## Contexto

Hay que fijar el stack antes de escribir la primera línea. Tres condiciones marcan la decisión:

1. La especificación maestra §16.1 ya propone Java 21 + Spring Boot 3 + PostgreSQL + Angular 18,
   justificado como «consistente con la línea técnica ya establecida» en otros proyectos.
2. El objetivo de escala es **1000 alumnos concurrentes**.
3. **El código se construirá con asistencia de Claude Opus.** Esto cambia el peso de los
   criterios: importa menos la velocidad de escritura e importa mucho más la capacidad de
   verificar y revisar lo que se produjo.

## Decisión

**Java 21 + Spring Boot 3 + Maven + PostgreSQL + Angular 18.** Se confirma lo que propone la
especificación.

## Alternativas consideradas

| Alternativa | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Java 21 + Spring Boot 3** (elegida) | Experiencia previa del equipo; tooling de pruebas y cobertura superior; compilador estricto; framework opinionado | Verboso (2–3× más código que TypeScript); arranque en frío lento en Cloud Run | — |
| NestJS + TypeScript | Un solo lenguaje en front y back; tipos compartidos entre las dos puntas; arranque casi instantáneo; menos tokens por cambio | Fuera de la experiencia del equipo; obliga a reescribir §16 de la especificación; ecosistema de pruebas menos maduro para integración con BD real | El ahorro no compensa perder fluidez de revisión sobre código que escribe una IA |
| Python + FastAPI | Desarrollo muy rápido; excelente si más adelante entra análisis de audio | Tipado opcional: el compilador no atrapa los errores de la IA; menos experiencia del equipo | El tipado débil es un riesgo desproporcionado en este modo de trabajo |
| Microservicios políglotas | Cada servicio en su mejor herramienta | Complejidad distribuida sin beneficio a esta escala | Sobredimensionado para la fase 1 |

## Consecuencias

**Positivas**

- `sealed interface` con `switch` exhaustivo hace que agregar un estado de negocio nuevo
  **rompa la compilación** en todo sitio que no lo contemple. Es la red que atrapa el error
  típico del código generado: olvidar un caso en un archivo que no se estaba mirando.
- Testcontainers + JaCoCo permiten exigir el 80% de cobertura contra PostgreSQL real, con el
  build fallando por debajo. La regla 10 se vuelve mecánica.
- Spring Boot es opinionado: hay una sola forma obvia de hacer cada cosa, así que el código
  no deriva entre sesiones de trabajo distintas. Eso sirve directamente a la regla 3.
- El equipo lee el código con fluidez. Código que no se puede revisar es una caja negra, y
  una caja negra en producción es un proyecto muerto.
- `record`, pattern matching y virtual threads reducen buena parte de la verbosidad histórica
  de Java y sirven a la regla 2.

**Negativas — lo que se acepta pagar**

- Más código por funcionalidad que en TypeScript: cada cambio cuesta más tiempo y más tokens.
- Arranque en frío de la JVM de 3–6 segundos. Se mitiga con `min-instances = 1` en Cloud Run,
  que tiene costo fijo mensual.
- Dos lenguajes en el proyecto, así que el contrato de la API debe mantenerse sincronizado a
  mano entre los DTOs de Java y las interfaces de TypeScript. Se mitiga exigiendo que ambos
  cambien en el mismo commit (posible gracias al monorepo, [ADR 0004](0004-monorepo.md)).

**Qué obligaría a revisar esta decisión**

- Que el costo de `min-instances` resulte inaceptable y GraalVM no lo resuelva.
- Que el proyecto incorpore procesamiento de audio o modelos de aprendizaje automático, donde
  el ecosistema de Python es dominante — en ese caso sería un servicio aparte, no un cambio
  de stack.
