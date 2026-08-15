# 07 · Proceso de trabajo y documentación

**Cubre la regla 14 del proyecto: todo proceso queda documentado.**

---

## 1. Ramas

`main` siempre desplegable. Nunca se trabaja directo sobre ella.

```
tipo/modulo-descripcion-corta

feat/pagos-webhook-wompi
fix/identidad-correo-duplicado
refactor/catalogo-extraer-puerto-consulta
docs/actualizar-contexto-fase-1
```

| Tipo | Uso |
|---|---|
| `feat` | Funcionalidad nueva |
| `fix` | Corrección de defecto |
| `refactor` | Cambio interno sin alterar comportamiento |
| `perf` | Mejora de rendimiento |
| `sec` | Corrección o refuerzo de seguridad |
| `test` | Solo pruebas |
| `docs` | Solo documentación |
| `chore` | Dependencias, build, configuración |

**Ramas cortas.** Una rama que vive más de tres días acumula conflictos. Si el trabajo es
grande, se integra por partes detrás de una bandera de funcionalidad (`docs/03 §4`).

---

## 2. Commits

Formato *conventional commits*, en español:

```
tipo(modulo): descripción en imperativo, sin punto final

Cuerpo opcional: explica POR QUÉ se hizo el cambio, no qué se cambió —
eso ya se ve en el diff.

Cierra #12
```

```
feat(pagos): registrar webhook de confirmación de Wompi

El acceso solo se otorga desde el webhook porque la redirección de retorno
puede ser manipulada por el cliente (no negociable #3).
```

**Reglas:** asunto de máximo 72 caracteres · imperativo (`agrega`, no `agregado`) · un commit
hace **una** cosa · **nunca** se commitea código que no compila.

---

## 3. Pull request

Ninguna fusión sin PR, aunque el equipo sea de una persona. El PR es el punto donde se
verifica que las reglas se cumplieron, y con desarrollo asistido por IA es la única barrera
real contra la deriva.

**Plantilla:**

```markdown
## Qué hace
Una o dos frases.

## Por qué
Regla de negocio, defecto o decisión que lo motiva.

## Cómo probarlo
Pasos concretos.

## Checklist
- [ ] `./mvnw verify` en verde (cobertura ≥80%, ArchUnit, linters)
- [ ] Sin valores de negocio escritos en el código (regla 4)
- [ ] Métodos públicos con su comentario de intención (regla 8)
- [ ] Nombres en español sin tildes ni ñ (regla 7)
- [ ] Componentes tomados del catálogo, no improvisados (regla 11)
- [ ] Autorización validada en backend (regla 16)
- [ ] Documentación de proceso actualizada (regla 14)
- [ ] ADR agregado si hubo decisión técnica de fondo
- [ ] Sin secretos en el diff
```

**Un PR toca preferiblemente un solo módulo.** Si toca tres, casi siempre significa que la
frontera está mal puesta o que son tres PRs.

---

## 4. Definición de terminado

Una tarea está terminada cuando **todo** esto se cumple. No cuando funciona en local:

- [ ] Cumple lo que pedía y no más (sin funcionalidad especulativa)
- [ ] Tests unitarios y de integración escritos, en verde, cobertura sobre el umbral
- [ ] Los cuatro estados de pantalla implementados si hay interfaz (cargando, vacío, error, sin permiso)
- [ ] Configuración parametrizada e inventariada en `docs/03 §3`
- [ ] Documentación del proceso escrita o actualizada
- [ ] Revisado en un PR y fusionado a `main`
- [ ] Probado en el ambiente desplegado

---

## 5. Documentación de procesos (regla 14)

Cada proceso de negocio implementado tiene un archivo en `docs/procesos/`, escrito **en el
mismo PR que lo implementa**. Documentar después no ocurre nunca.

Nombre: `docs/procesos/<modulo>-<proceso>.md` — por ejemplo `pagos-confirmacion-webhook.md`.

**Plantilla obligatoria:**

```markdown
# Proceso: <nombre>

**Módulo:** · **Fase:** · **Estado:** vigente | obsoleto · **Actualizado:**

## Qué resuelve
Una frase desde el punto de vista del negocio.

## Disparador
Qué lo inicia: una acción del usuario, un webhook, una tarea programada.

## Flujo
Pasos numerados, indicando en qué capa ocurre cada uno.

## Reglas de negocio aplicadas
Cuáles se hacen cumplir aquí. Enlazar los no negociables involucrados.

## Configuración
Parámetros que lo afectan, con su valor por defecto.

## Errores y qué se le muestra al usuario
Tabla: situación → código → mensaje.

## Cómo probarlo
Manual y automático (nombres de los tests que lo cubren).

## Puntos frágiles
Qué se puede romper y qué habría que revisar primero.
```

**Procesos que deben quedar documentados** (mínimo): registro y unificación de cuentas ·
otorgamiento de acceso · confirmación de pago por webhook · desbloqueo de nivel · emisión y
verificación de certificado · firma de URL de video · calificación de examen · descuento de
stock y despacho · edición de secuencias del simulador.

---

## 6. Registros de decisión (ADR)

Las decisiones técnicas de fondo se escriben en `docs/adr/`, numeradas y **nunca borradas**.
Una decisión que cambia no se edita: se marca como reemplazada y se escribe una nueva.

**Se escribe un ADR cuando:** se elige entre alternativas con consecuencias duraderas, se
introduce una dependencia importante, se cambia una frontera de arquitectura, se rompe
deliberadamente una regla de estos documentos, o se descarta una opción por una razón que
alguien podría querer revisar en seis meses.

**No se escribe** para decisiones reversibles en una tarde.

Plantilla en [`adr/PLANTILLA.md`](adr/PLANTILLA.md).

---

## 7. Integración continua

| Etapa | Qué corre | Bloquea |
|---|---|---|
| Pre-commit | Formato, linter, `gitleaks` | Sí, en local |
| PR abierto | Compilación, tests, cobertura, ArchUnit, Checkstyle, PMD, SpotBugs, auditoría de dependencias, tests y cobertura del frontend | Sí |
| Fusión a `main` | Todo lo anterior + imagen de contenedor + despliegue a pruebas + E2E | Sí |
| Despliegue a producción | Manual, con la revisión de seguridad de `docs/06 §10` | — |
| Semanal | Pruebas de mutación, auditoría de dependencias, escaneo de imagen | Alerta |

**Nada se salta.** Un umbral bajado «temporalmente» nunca vuelve a subir.

---

## 8. Migraciones de base de datos

- Formato `V###__descripcion_en_minusculas.sql`, numeración correlativa sin huecos.
- **Una migración publicada jamás se edita.** Se corrige con una nueva.
- Toda migración debe poder aplicarse sobre una base vacía y sobre una base con datos.
- Los cambios destructivos (borrar columna, cambiar tipo) van en **dos despliegues**: primero
  se agrega lo nuevo y el código escribe en ambos; después se elimina lo viejo. Con usuarios
  activos no hay ventana para un cambio atómico.
- Cada migración se prueba en el arranque de los tests de integración (`docs/05 §5`).

---

## 9. Arranque de una sesión de trabajo

Este proyecto se construye con asistencia de IA, así que cada sesión empieza sin memoria de la
anterior. El orden que evita la deriva:

1. Leer `CLAUDE.md` — reglas y no negociables.
2. Leer `docs/00-contexto.md` — estado actual y decisiones abiertas.
3. Leer el documento de proceso del módulo que se va a tocar, si existe.
4. Revisar si ya hay código equivalente en ese módulo **antes** de escribir nada. La
   duplicación silenciosa es el modo de falla principal del desarrollo asistido.
5. Trabajar en una rama, con tests, en un solo módulo.
6. Cerrar actualizando `docs/00-contexto.md §8` (bitácora) y el proceso correspondiente.

**Si algo no está escrito en `docs/`, no está decidido.** Se pregunta o se propone un ADR; no
se resuelve sobre la marcha y se olvida.
