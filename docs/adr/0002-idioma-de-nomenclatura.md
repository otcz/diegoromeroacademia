# ADR 0002 · Idioma de nomenclatura: español sin tildes ni eñes

**Estado:** aceptado
**Fecha:** 2026-08-14
**Deciden:** Oscar Tomás Carrillo Zuleta

---

## Contexto

El modelo de datos de la especificación maestra §15 ya está escrito en español: `usuario`,
`acceso_recurso`, `secuencia_pisada`, `intento_examen`. El negocio, el cliente y todo el
contenido son en español. Hay que decidir si el código sigue ese vocabulario o se traduce
al inglés.

El dominio además tiene términos que **no tienen traducción razonable**: `guacharaca`,
`fuelle`, `pisada`, `afinación FBE`. Traducirlos produciría nombres que nadie entendería.

## Decisión

**Todo el código se nombra en español**, incluidos los sufijos técnicos (`UsuarioRepositorio`,
`PagoServicio`). Lo único que permanece en inglés es lo que no nos pertenece: anotaciones y
APIs de framework (`@RestController`, `ngOnInit`, `Optional.map`).

**Los identificadores no llevan tildes ni eñes.** `anio`, `contrasena`, `numeroDocumento`,
`disenio`. Los comentarios y la documentación sí van en español correcto, con tildes.

## Alternativas consideradas

| Alternativa | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Español completo** (elegida) | Un solo vocabulario entre negocio, base de datos, API y código; términos del dominio intraducibles conservan su nombre real | Se aparta de la convención mayoritaria de Spring; los ejemplos de internet no coinciden | — |
| Todo en inglés | Convención internacional; alineado con las librerías | Obliga a traducir el modelo de datos ya aprobado; crea dos vocabularios que hay que mapear mentalmente en cada consulta; `guacharaca` y `fuelle` no tienen traducción | El costo de traducción permanente supera el beneficio |
| Dominio en español, técnico en inglés | Punto medio habitual | La frontera entre «dominio» y «técnico» es discutible en cada clase, y una regla discutible se aplica de forma inconsistente | Se prefirió una regla sin zona gris |

## Consecuencias

**Positivas**

- El nombre de una tabla, el de su clase de dominio, el del campo JSON y el de la variable en
  Angular son el mismo concepto con la misma palabra. Elimina una capa entera de traducción
  mental y una fuente constante de errores.
- El glosario de `docs/00-contexto.md §3` funciona como lenguaje ubicuo real: sirve para hablar
  con Diego y para nombrar clases, sin dos diccionarios.

**Negativas — lo que se acepta pagar**

- Los ejemplos de documentación de Spring y de Stack Overflow no coinciden con nuestros
  nombres. Es un costo de lectura, no de mantenimiento.
- Sin tildes, algunas palabras se ven mal escritas (`anio`, `espaniol`). Es deliberado.

**Por qué la restricción de tildes es técnica y no estética**

Una `ñ` o una tilde en un nombre de clase, columna o archivo produce fallos de codificación
entre el contenedor, el driver de PostgreSQL, el sistema de archivos y herramientas de
terceros. Los fallos son **intermitentes** —solo aparecen en algunos entornos— y por eso
resultan desproporcionadamente caros de diagnosticar. La regla elimina la categoría entera
de problema por adelantado.

**Qué obligaría a revisar esta decisión**

- Que entre al proyecto desarrollo que no hable español.
