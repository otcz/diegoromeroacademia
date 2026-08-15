# ADR 0007 · Uso del servidor físico de laboratorio

**Estado:** propuesto
**Fecha:** 2026-08-14
**Deciden:** Oscar Tomás Carrillo Zuleta

> **Nota de seguridad:** este ADR no contiene direcciones, nombres de host, rutas de llaves ni
> credenciales del servidor. Esos datos viven fuera del repositorio, deliberadamente. Aquí solo
> se registra la decisión y su porqué.

---

## Contexto

Existe un servidor físico propio, hoy infrautilizado: 48 hilos, 61 GB de RAM y 1,4 TB de disco
al 4% de ocupación. Ya corre Docker y aloja los servicios de otros dos proyectos.

La [especificación §16.1](../especificacion-maestra.md) y toda la configuración escrita hasta
ahora asumen **Cloud Run en GCP** para producción: `min-instances=1`, Cloud SQL, Secret Manager
y registro estructurado para Cloud Logging.

La pregunta natural es si aprovechar ese hierro ocioso en lugar de pagar GCP durante meses de
desarrollo sin un solo alumno. Pero «entorno de pruebas» significa **tres cosas distintas**, y
mezclarlas es lo que lleva a decidir mal:

| Necesidad | Qué la resuelve hoy |
|---|---|
| **1. Pruebas automatizadas** | Testcontainers levanta PostgreSQL efímero **en la máquina que corre el build** (docs/05 §5) |
| **2. Entorno desplegado para revisar pantallas** | No existe. Diego necesita ver y aprobar el avance |
| **3. Integración continua** | GitHub Actions, sobre el repositorio ya publicado |

Solo la segunda está sin resolver.

## Decisión

**El servidor se usa como entorno de demostración y de datos compartidos de desarrollo. No como
sustituto de GCP.**

Sí se aloja ahí:

- **PostgreSQL de desarrollo compartido**, con datos de catálogo sembrados. Evita que cada
  persona mantenga su propia base a mano y da un estado común para revisar.
- **Una copia desplegada de backend y frontend** para que Diego revise pantallas y apruebe
  diseño desde su teléfono, sin instalar nada.

**No** se aloja ahí:

- **Las pruebas automatizadas.** Testcontainers corre donde corre el build. Apuntarlas a una
  base remota compartida rompería el aislamiento entre ejecuciones, que es justamente lo que
  las hace fiables.
- **La integración continua.** Un runner autoalojado obligaría a que GitHub alcanzara la red
  privada del servidor, con una llave de autenticación más que custodiar.
- **La validación previa a producción.** Eso debe correr en Cloud Run: un despliegue que no se
  parece a producción no valida el despliegue.
- **Producción.** Nunca.

## Alternativas consideradas

| Alternativa | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Híbrido: demo y datos de desarrollo en el servidor, todo lo demás en GCP** (elegida) | Usa el hierro donde aporta y evita el costo de GCP en desarrollo; Diego obtiene una URL que abrir | Dos superficies operativas que mantener | — |
| Todo en GCP desde el día uno | Un solo entorno, idéntico a producción | Cloud SQL y Cloud Run corriendo meses sin usuarios, con costo real y ningún beneficio a cambio | Gasto sin retorno durante el desarrollo |
| Todo en el servidor, incluidos CI y validación previa | Cero costo de nube durante el desarrollo | La validación dejaría de parecerse a producción y no detectaría los fallos propios de Cloud Run: arranque en frío, cableado de Secret Manager, límite de tiempo por petición, exigencia de no guardar estado | Un entorno de validación que no se parece a producción da confianza falsa, que es peor que no tener ninguno |
| Nada: solo desarrollo local | Lo más simple | Diego no tiene forma de ver el avance, y su aprobación es lo que desbloquea cada pantalla | El cuello de botella del proyecto es la revisión de contenido, no la infraestructura |

## Consecuencias

**Positivas**

- Diego revisa pantallas desde el teléfono con solo abrir un enlace. En un proyecto donde el
  contenido y el diseño los aprueba una persona no técnica, eso deja de ser comodidad y pasa a
  ser lo que marca el ritmo de las fases.
- No se paga Cloud SQL ni Cloud Run mientras no haya alumnos.
- El servidor ya tiene Docker y compose en uso, así que no hay herramienta nueva que aprender.

**Negativas — lo que se acepta pagar**

- **El acceso administrativo depende de la red privada.** Quien no esté en ella no llega al
  servidor. Es una dependencia operativa real, no un detalle.
- **Publicar la demo la hace pública.** El mecanismo disponible en ese servidor expone a
  internet, sin exigir pertenencia a la red privada. La demo **debe llevar autenticación
  propia**: contraseña o lista de correos permitidos. Nunca se siembra con datos personales
  reales ni con credenciales de pasarela de producción.
- **Divergencia con producción.** Docker sobre Ubuntu no es Cloud Run. La demo sirve para
  validar pantallas y flujos, **no** para validar despliegues.
- **Punto único de fallo en una oficina**: corriente, conexión, o alguien que desconecta algo.
  Aceptable para una demo; inaceptable para producción.
- **Convivencia con otros dos proyectos** en la misma máquina. Los contenedores de la Academia
  van con nombre propio y puertos propios, y no se toca nada ajeno.

**Qué obligaría a revisar esta decisión**

- Que entre al equipo alguien que no pueda unirse a la red privada.
- Que la demo empiece a usarse para validar despliegues: en ese momento hace falta un entorno
  de preproducción real en Cloud Run.
- Que el consumo de los otros proyectos deje sin recursos a la demo.
- El lanzamiento de la fase 1: con alumnos reales, producción va a Cloud Run sin discusión.

## Cómo se documenta el acceso

Los datos de conexión, el inventario de servicios y las restricciones conocidas del servidor
**no entran a este repositorio**. Se mantienen fuera, en el traspaso de infraestructura, y se
referencian desde aquí solo por su existencia.

Cuando se levante el entorno, el procedimiento de despliegue se documenta en
`docs/procesos/plataforma-entorno-demostracion.md`, siguiendo la plantilla de
[docs/07 §5](../07-proceso.md) — y también sin credenciales.
