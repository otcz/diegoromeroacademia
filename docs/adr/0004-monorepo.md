# ADR 0004 · Monorepo

**Estado:** aceptado
**Fecha:** 2026-08-14
**Deciden:** Oscar Tomás Carrillo Zuleta

---

## Contexto

El proyecto tiene dos artefactos —backend Spring Boot y frontend Angular— más la
documentación. Hay que decidir si viven juntos o separados.

Un factor pesa especialmente: el contrato de la API se mantiene **a mano** entre los DTOs de
Java y las interfaces de TypeScript ([ADR 0001](0001-stack-tecnologico.md)). Cualquier
desincronización entre ambos es un defecto que solo aparece en tiempo de ejecución.

## Decisión

**Monorepo:** `backend/`, `frontend/` y `docs/` en un solo repositorio, con un solo historial.

## Alternativas consideradas

| Alternativa | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Monorepo** (elegida) | El cambio de API y su cliente viajan en el mismo commit; una sola documentación; un solo CI; se puede leer el contrato completo de una vez | El repositorio crece; el CI debe filtrar por carpeta para no correr todo siempre | — |
| Dos repositorios | Despliegues y ciclos de vida totalmente independientes | Duplica CI y documentación; obliga a coordinar versiones entre repos; un cambio de contrato se parte en dos PRs que pueden fusionarse desfasados | El riesgo de desincronización del contrato supera el beneficio |

## Consecuencias

**Positivas**

- Un cambio de contrato es **un solo commit** con las dos puntas. Es imposible fusionar la
  mitad y olvidar la otra.
- Trabajando con IA, tener las dos puntas del contrato en el mismo árbol permite verificarlas
  a la vez en lugar de suponer una de ellas.
- `docs/`, `CLAUDE.md` y los ADR aplican a todo el proyecto desde un solo lugar.
- Un solo `README`, un solo flujo de ramas, un solo tablero de PRs.

**Negativas — lo que se acepta pagar**

- El CI debe filtrar por carpeta (`paths`) para no ejecutar la suite del frontend cuando solo
  cambió una migración SQL.
- Los despliegues se disparan por separado aunque el historial sea común.
- El repositorio pesa más al clonar.

**Qué obligaría a revisar esta decisión**

- Que el frontend se abra a un equipo externo que no deba tener acceso al backend.
