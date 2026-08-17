# ADR 0013 · Rutas y armazón de la aplicación del estudiante

**Estado:** aceptado
**Fecha:** 2026-08-16
**Deciden:** Oscar Tomás Carrillo Zuleta

---

## Contexto

El handoff de la aplicación del estudiante trae trece pantallas con sus **rutas sugeridas**:
`/inicio`, `/cursos`, `/clases/:id`, `/ejercicios`, `/tutoriales`, `/tienda`, `/regalar`,
`/suscripcion`, `/perfil`, `/ajustes`, `/certificados/:id`.

La especificación maestra (§6.1) ya nombraba varias de esas pantallas, y con otros nombres:
`/mis-cursos`, `/curso/{slug}`, `/clase/{id}`, `/practica`, `/practica/{ejercicio}`, `/carrito`,
`/mis-compras`.

Una URL publicada no se cambia sin coste, así que hay que elegir una sola vez.

## Decisión

### 1. Manda la especificación donde ya definía una ruta

`CLAUDE.md` lo dice: si algo contradice a `docs/`, gana `docs/`. Y el propio handoff llama a las
suyas «rutas **sugeridas**», no aprobadas.

| Pantalla | Ruta | Origen |
|---|---|---|
| Panel del alumno | `/inicio` | Nueva — la especificación no tenía panel |
| Mis cursos | `/mis-cursos` | Especificación §6.1 |
| Clase | `/clase/:id` | Especificación §6.1 (singular) |
| Zona de ejercicios | `/practica` | Especificación §6.1 |
| Ejercicio guiado | `/practica/:id` | Especificación §6.1 |
| Tutoriales / Ver tutorial | `/tutoriales`, `/tutoriales/:id` | Nuevas |
| Tienda | `/tienda` | Coinciden |
| Regalar | `/regalar` | Nueva |
| Mi suscripción | `/suscripcion` | Nueva |
| Mi perfil | `/perfil` | Especificación §6.1 |
| Ajustes | `/ajustes` | Nueva |
| Certificado | `/certificados/:id` | Especificación §6.1 (`/certificados`), con detalle |

**`/carrito` no existe como pantalla.** El handoff lo resuelve como panel lateral con velo, y esa
es la forma aprobada. Una segunda pantalla con el mismo contenido sería una segunda
implementación de las cantidades, el subtotal y el envío.

### 2. Las trece cuelgan de un padre de ruta vacía

Todas son hijas de un `{ path: '', component: Shell, children: [...] }`. Así comparten **una sola
instancia del armazón**: al navegar entre secciones, Angular no vuelve a crear el menú, la barra
lateral no parpadea y el panel del carrito abierto no se cierra solo.

El orden importa y no es negociable: la portada (`''` con `pathMatch: 'full'`) y `/acceso` van
**antes**; el comodín `**`, **después**. Un padre de ruta vacía casa con cualquier URL, así que
arriba se quedaría con la portada.

### 3. Entrar lleva al panel, no a la portada

`DESTINO_TRAS_INGRESAR` pasa de `/` a `/inicio`, y con él la variable `IDENTIDAD_DESTINO_OK` del
backend (`application.yml`). Era la condición de salida anotada en `app.routes.ts` desde que se
construyó la pantalla de acceso.

## Alternativas consideradas

| Alternativa | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Rutas de la especificación + armazón padre** (elegida) | Una sola fuente de verdad para las URL; una instancia del menú | Hay que reconciliar dos listas de nombres | — |
| Rutas del handoff tal cual | Coinciden con la maqueta | Contradicen `docs/` sin ADR y renombran URL ya documentadas | Las llama «sugeridas» el propio handoff |
| Un prefijo, `/app/inicio` | Sin ambigüedad de enrutado, cero riesgo con el comodín | URL más largas y ajenas a lo documentado | El riesgo del padre vacío se cubre con una prueba |
| El armazón dentro de cada pantalla | Sin padre vacío | Trece instancias del menú; se recrea en cada navegación | Es el problema que el padre resuelve |

## Consecuencias

**Positivas**

- `app.routes.spec.ts` navega **de verdad** a las trece rutas y comprueba que sale la pantalla y
  que trae el armazón. Cubre las dos trampas del padre vacío: que se quede con la portada y que
  deje el comodín inalcanzable —lo segundo convertiría cualquier enlace roto en una pantalla en
  blanco dentro del menú, indistinguible de una que no cargó.
- `RUTAS_INTERNAS` pasó a recorrer las rutas **hijas**. La versión plana dejó de ver las trece en
  cuanto colgaron del armazón: la prueba de enlaces rotos seguía en verde porque ya no miraba
  donde estaban. Una comprobación que deja de comprobar sin fallar es peor que no tenerla.

**Negativas — lo que se acepta pagar**

- Las rutas no coinciden con las de la maqueta. Quien compare el prototipo con la aplicación verá
  `/practica` donde el handoff dice `/ejercicios`.
- **Ninguna de las trece exige sesión todavía.** No hay guarda: el backend solo expone
  `identidad`, y con datos simulados una guarda dejaría la demostración inalcanzable para el
  propietario. La autorización real se valida en el backend (no negociable 4), que es donde
  cuenta; lo que falta aquí es la comodidad de no ver una pantalla sin sentido.

**Qué obligaría a revisar esta decisión**

- Que el módulo `aprendizaje` exponga sus endpoints: entonces cada pantalla pide datos con sesión
  y hace falta la guarda de experiencia de usuario.
- Que se decida publicar alguna pantalla sin sesión (por ejemplo, la verificación pública de un
  certificado), que tendría que salir del armazón.
