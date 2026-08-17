# Documentación de procesos

**Regla 14 del proyecto: todo proceso que se implemente queda documentado.**

Cada proceso de negocio tiene aquí un archivo, escrito **en el mismo pull request que lo
implementa**. Documentar después no ocurre nunca: se posterga hasta que quien lo escribió ya
no recuerda por qué tomó cada decisión.

**Nombre del archivo:** `<modulo>-<proceso>.md` — por ejemplo `pagos-confirmacion-webhook.md`.

**Plantilla obligatoria:** ver [`../07-proceso.md` §5](../07-proceso.md).

---

## Procesos documentados

| Proceso | Archivo | Módulo | Fecha |
|---|---|---|---|
| Rediseño de la portada | [`frontend-redisenio-landing.md`](frontend-redisenio-landing.md) | frontend | 2026-08-15 |
| Correcciones de la portada | [`frontend-correcciones-landing.md`](frontend-correcciones-landing.md) | frontend | 2026-08-15 |
| Aplicación del estudiante: 13 pantallas y doble tema | [`frontend-app-del-estudiante.md`](frontend-app-del-estudiante.md) | frontend | 2026-08-16 |

---

## Procesos pendientes de implementar y documentar

| Proceso | Archivo previsto | Módulo | Fase |
|---|---|---|---|
| Registro y unificación de cuentas | `identidad-registro-unificacion.md` | `identidad` | 1 |
| Ingreso con proveedor externo | `identidad-oauth-vinculacion.md` | `identidad` | 1 |
| Control de dispositivos simultáneos | `identidad-limite-dispositivos.md` | `identidad` | 1 |
| Otorgamiento de acceso a recurso | `acceso-otorgamiento.md` | `acceso` | 1 |
| Confirmación de pago por webhook | `pagos-confirmacion-webhook.md` | `pagos` | 1 |
| Alta y renovación de suscripción | `pagos-ciclo-suscripcion.md` | `pagos` | 1 |
| Firma de URL de video | `contenido-url-firmada.md` | `contenido` | 1 |
| Registro de avance de clase | `aprendizaje-avance-clase.md` | `aprendizaje` | 1 |
| Desbloqueo de nivel | `aprendizaje-desbloqueo-nivel.md` | `aprendizaje` | 1 |
| Calificación de examen mixto | `evaluacion-calificacion-examen.md` | `evaluacion` | 2 |
| Cola de revisión del instructor | `evaluacion-cola-revision.md` | `evaluacion` | 2 |
| Emisión y verificación de certificado | `evaluacion-certificado.md` | `evaluacion` | 2 |
| Edición de secuencias del simulador | `practica-editor-secuencias.md` | `practica` | 3 |
| Reproducción sincronizada del simulador | `practica-simulador.md` | `practica` | 3 — el componente ya existe con datos simulados; falta la pista real y su origen |
| Descuento de stock y despacho | `comercio-stock-despacho.md` | `comercio` | 4 |
| Cierre de compra en tienda | `comercio-cierre-compra.md` | `comercio` | 4 |
| Respuesta ante filtración de credenciales | `seguridad-respuesta-incidente.md` | transversal | 1 |

Un proceso que se vuelve obsoleto **no se borra**: se marca `Estado: obsoleto` y se enlaza el
que lo reemplaza. El historial de cómo funcionaba antes es lo que permite entender los datos
viejos cuando aparece un reclamo.
