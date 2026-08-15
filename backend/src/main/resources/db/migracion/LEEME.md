# Migraciones de base de datos

**Decisión heredada de la especificación §16.1: migraciones SQL manuales, sin Flyway ni
Liquibase.**

## Convención

```
V###__descripcion_en_minusculas.sql
```

Numeración correlativa **sin huecos**. `V001__crear_usuario.sql`, `V002__crear_acceso_recurso.sql`.

## Reglas

1. **Una migración publicada jamás se edita.** Se corrige con una nueva. Editarla deja las
   bases que ya la aplicaron en un estado distinto al que dice el archivo.
2. Toda migración debe aplicarse **sobre una base vacía y sobre una base con datos**.
3. Los cambios destructivos (borrar columna, cambiar tipo) van en **dos despliegues**:
   primero se agrega lo nuevo y el código escribe en ambos; después se elimina lo viejo.
   Con alumnos activos no hay ventana para un cambio atómico.
4. Los índices se definen **en la misma migración** que crea la tabla, no cuando el
   rendimiento empiece a doler.
5. `spring.jpa.hibernate.ddl-auto` está en `validate`: si el esquema no coincide con las
   entidades, la aplicación **no arranca**. Es deliberado.

## Cómo se aplican

```bash
psql "$BD_URL" -v ON_ERROR_STOP=1 -f src/main/resources/db/migracion/V001__nombre.sql
```

En las pruebas de integración las aplica la clase base de Testcontainers, en orden, sobre un
contenedor limpio. Así una migración que no corre en limpio rompe el build antes de romper
un despliegue.

---

## Pendiente de decidir

Sin Flyway ni Liquibase, **nada lleva registro de qué migración se aplicó** en cada base.
Hoy eso queda en manos de quien despliega, lo que funciona con una persona y falla en cuanto
hay dos entornos y una duda.

Hay dos salidas, y conviene elegir antes de la primera migración real de la fase 1:

| Opción | A favor | En contra |
|---|---|---|
| Tabla `migracion_aplicada` + ejecutor propio (~60 líneas) | Respeta la decisión original; aplica y registra igual en local, pruebas y producción | Es código propio que hay que mantener y probar |
| Revisar la decisión y adoptar Flyway | Resuelto, probado por miles de proyectos, con reparación y verificación de sumas | Contradice la especificación §16.1 |

**Recomendación:** revisar la decisión. Flyway hace exactamente esto y su ausencia no
simplifica nada — solo traslada el problema a un procedimiento manual, que es justo donde
los errores no dejan rastro.
