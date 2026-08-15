# ADR 0003 · Monolito modular con arquitectura hexagonal

**Estado:** aceptado
**Fecha:** 2026-08-14
**Deciden:** Oscar Tomás Carrillo Zuleta

---

## Contexto

El proyecto es pequeño hoy pero abarca dominios muy distintos: identidad, catálogo,
aprendizaje, evaluación, práctica con simulador, comercio con inventario y pagos. Se entrega
en cinco fases, con un equipo de una persona apoyado por IA.

Dos restricciones tiran en direcciones opuestas: no hay capacidad operativa para mantener
varios servicios, pero **sí** hace falta que un cambio en pagos no pueda romper el catálogo —
sobre todo porque el código lo escribe una IA que trabaja con contexto parcial y sin memoria
entre sesiones.

Además, tres decisiones de infraestructura siguen abiertas (pasarela de pago, proveedor de
video, proveedor de correo). El código tiene que poder escribirse **antes** de resolverlas.

## Decisión

**Monolito modular con arquitectura hexagonal (puertos y adaptadores).** Un solo artefacto
desplegable, dividido en módulos por dominio de negocio, con las fronteras verificadas por
ArchUnit en cada build.

El dominio no conoce Spring, JPA ni ninguna infraestructura: **declara** las interfaces que
necesita y la infraestructura las implementa.

## Alternativas consideradas

| Alternativa | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Monolito modular + hexagonal** (elegida) | Un despliegue; fronteras reales verificadas por el build; dominio testeable sin Spring; permite decidir la infraestructura después; un módulo se puede extraer más adelante | Más archivos y más indirección al principio; requiere disciplina de mapeo entre capas | — |
| Capas clásicas (controller/service/repository) | Arranque más rápido; familiar | Los servicios crecen hasta acumular todo; el acoplamiento cruzado no lo detiene nada; es el camino directo al espagueti de la regla 3 | El modo de falla es exactamente lo que el proyecto quiere evitar |
| Hexagonal estricto con módulos Maven separados | El aislamiento lo impone el build, no la convención | Mucha ceremonia de configuración para la fase 1; compilaciones más lentas | Desproporcionado hoy; ArchUnit da casi el mismo aislamiento sin el costo |
| Microservicios | Escalado y despliegue independientes | Complejidad distribuida, observabilidad, transacciones repartidas — sin ningún beneficio a esta escala | Sobredimensionado |

## Consecuencias

**Positivas**

- Las decisiones pendientes dejan de bloquear: el dominio depende de `PasarelaPagoPuerto`, y
  elegir Wompi o Mercado Pago después es escribir un adaptador sin tocar el negocio.
- El dominio se prueba sin levantar Spring, en milisegundos. Eso es lo que hace viable la
  pirámide de `docs/05` y, con ella, el 80% de cobertura.
- Cada módulo es una carpeta cerrada. Se puede trabajar en `pagos` sin abrir un archivo de
  `catalogo`, lo que reduce el riesgo de que un cambio asistido por IA toque lo que no debía.
- ArchUnit convierte la regla 3 en algo que el build verifica, no en algo que hay que recordar.
  Es la diferencia entre una convención y una garantía.

**Negativas — lo que se acepta pagar**

- Más archivos por funcionalidad: modelo de dominio, entidad JPA y mapeador entre ambos. La
  duplicación aparente es el precio del desacoplamiento.
- Curva inicial: hay que resistir la tentación de exponer la entidad JPA directamente.
- El módulo `compartido` tenderá a crecer. La regla —solo entra lo que usan tres o más módulos
  y no tiene reglas de negocio— hay que hacerla cumplir en cada revisión.

**Qué obligaría a revisar esta decisión**

- Que un módulo concreto (previsiblemente `contenido` o `practica`) desarrolle un perfil de
  carga o de despliegue tan distinto que justifique extraerlo. La arquitectura ya lo permite
  sin reescritura.
