# ADR 0006 · Corrección de versiones: Spring Boot 4 y Angular 21

**Estado:** aceptado
**Fecha:** 2026-08-14
**Deciden:** Oscar Tomás Carrillo Zuleta
**Reemplaza parcialmente:** [ADR 0001](0001-stack-tecnologico.md) — solo en las versiones,
no en la elección de plataforma

---

## Contexto

La especificación maestra §16.1 y el [ADR 0001](0001-stack-tecnologico.md) fijaron
**Spring Boot 3** y **Angular 18**. Al montar el andamiaje se comprobó que ambas versiones
están fuera de soporte:

| Framework | Hallazgo |
|---|---|
| **Spring Boot 3** | Spring Initializr ya **no ofrece ninguna versión 3.x**. Solo 4.0.7 y 4.1.0. La línea 3 salió del soporte abierto |
| **Angular 18** | Su último parche es **18.2.21, del 10 de septiembre de 2025**, hace casi un año. Angular da 6 meses de soporte activo más 12 de LTS; v18 los agotó |

Esto no es una preferencia de estar al día. Una versión sin soporte **no recibe parches de
seguridad**, y esta plataforma procesa pagos y almacena documentos de identidad para emitir
certificados (docs/06 §7). Arrancar un proyecto nuevo sobre una base sin parches sería
aceptar una deuda de seguridad desde el primer commit.

## Decisión

- **Backend: Spring Boot 4.1.0** sobre Java 21.
- **Frontend: Angular 21** (21.2.x) con Angular CDK 21.

## Alternativas consideradas

| Alternativa | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Spring Boot 4.1 + Angular 21** (elegida) | Ambas con soporte y parches; Angular 21 lleva ~9 meses publicado, así que el ecosistema ya se puso al día | Obliga a corregir la especificación §16.1 | — |
| Mantener Boot 3 + Angular 18 | Coincide con lo escrito en la especificación | Sin parches de seguridad; Initializr ni siquiera genera Boot 3; obliga a migrar en pocos meses | Inaceptable en una plataforma con pagos y datos personales |
| Ir a Angular 22 (última) | Más tiempo antes del fin de soporte | Publicada **el día anterior** a esta decisión; las librerías del ecosistema aún no la soportan (el propio `@angular/cdk@22` exige Angular 22 y rompe con 21) | Estrenar un mayor recién salido en el arranque del proyecto añade riesgo sin beneficio inmediato |

## Consecuencias

**Positivas**

- Ambas plataformas reciben parches de seguridad durante todo el desarrollo previsto
  (fases 1 a 5).
- Angular 21 trae por defecto lo que el proyecto iba a configurar a mano: **zoneless**
  (sin `zone.js`, menos peso y menos magia), **Vitest** como motor de pruebas y componentes
  standalone sin ceremonia.
- Spring Boot 4 permite `sealed interface` y `record` igual que Boot 3, así que el
  razonamiento de verificabilidad del ADR 0001 se mantiene intacto.

**Negativas — lo que se acepta pagar**

- Hay que corregir la §16.1 de la especificación maestra, que quedó desactualizada.
- Spring Boot 4 renombró los starters (`spring-boot-starter-web` pasó a
  `spring-boot-starter-webmvc`) e introdujo starters de prueba por módulo. Los ejemplos de
  internet escritos para Boot 3 no se copian tal cual.
- Boot 4 lleva menos tiempo publicado que Boot 3, así que hay menos respuestas escritas
  sobre sus particularidades.

**Qué obligaría a revisar esta decisión**

- El fin de soporte de Angular 21, previsto para mediados de 2027: entonces toca `ng update`
  a la versión vigente.
- Cualquier vulnerabilidad crítica sin parche en la línea elegida.
