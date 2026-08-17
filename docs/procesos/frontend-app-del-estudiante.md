# Proceso · Construcción de la aplicación del estudiante

**Fecha:** 2026-08-16 · **Regla 14:** todo proceso queda documentado al terminarlo.

Recreación en Angular del handoff `docs/handoff-disenio/app-estudiante`: las trece pantallas
que hay tras iniciar sesión, más el doble tema en todo el sitio.

---

## 1. Qué entró y qué se decidió antes de escribir código

El paquete traía tres prototipos `.dc.html` (la aplicación responsive completa, los mockups de
móvil y tablet, y las exploraciones del login), un README con tokens y comportamientos, y dos
imágenes. Tres cosas del handoff **chocaban** con las reglas del proyecto, y las decidió el
propietario antes de empezar:

| Conflicto | Handoff | Decisión |
|---|---|---|
| Tipografía | Archivo, familia única | **Se conserva** Bricolage Grotesque + Instrument Sans. Se añade lo que el handoff aporta y no existía |
| Tema | Oscuro por defecto + claro | **Doble tema en todo el sitio**, portada incluida — [ADR 0012](../adr/0012-doble-tema-en-todo-el-sitio.md) |
| Iconos | Trazo tipo Lucide, 13–20 px | **Phosphor duotone** (regla 12, ADR 0005). Cada icono traducido a su equivalente |

Las rutas las resolvió [ADR 0013](../adr/0013-rutas-de-la-aplicacion-del-estudiante.md): el
handoff llama a las suyas «sugeridas», así que manda la especificación donde ya definía una.

---

## 2. Orden en que se construyó

1. **Capa semántica de tokens** y servicio de tema. Es la base: sin ella, cada pantalla habría
   nacido clavada en un tema.
2. **Migración de la portada y el catálogo** a los tokens semánticos. Los nombres anteriores
   quedaron como alias, así que fueron ~25 cambios con criterio en vez de 200 mecánicos.
3. **Armazón**: barra lateral, barra superior, navegación inferior, panel del carrito.
4. **Modelos y servicios** con datos simulados, uno por dominio.
5. **Reproductor y simulador de pisadas** — el riesgo técnico estaba aquí.
6. **Las trece pantallas.**
7. **Pruebas, ADR y esta documentación.**

---

## 3. Lo que se encontró por el camino

**Un fallo real en el simulador, cazado por su prueba.** Dentro del bucle de botones, `$index`
es el del BOTÓN y tapa al de la fila, así que `estaActivo($index, boton)` recibía el número de
botón como número de fila: **el simulador encendía la tecla equivocada**. Es el único error que
este componente no puede permitirse — el alumno aprende la digitación que le señalan. Se
corrigió con `let indiceFila = $index` y quedó una prueba que compara la lectura textual paso a
paso.

**Una guarda de rejillas que marcaba siete rejillas correctas.** `rejillas.spec.ts` borraba los
`minmax(...)` con una expresión que se para en el primer paréntesis de cierre; con
`minmax(min(240px, 100%), 1fr)` —el patrón responsive que pide el handoff— dejaba `OK, 1fr)` y
el `1fr` sobrevivía. El fallo era de la expresión regular. Se sustituyó por un recorrido que
respeta los paréntesis anidados.

**Un auditor de contraste sobre el DOM que no servía.** Recorrer los textos y componer el fondo
de sus ancestros falla en cuanto hay dos superficies translúcidas encima, que es justo lo normal
en el tema oscuro. Marcaba nueve textos correctos como fallidos. Se sustituyó por
`disenio/contraste.spec.ts`, que mide **pares de tokens** compuestos sobre su pila real: es
exacto, cubre las trece pantallas de una vez y falla sobre el valor que hay que cambiar.

**Tres valores del handoff no cumplían AA** y se corrigieron con el criterio del ADR 0009. Están
en la tabla del ADR 0012.

**El armazón dejó ciega a la prueba de enlaces rotos.** `RUTAS_INTERNAS` se derivaba de las rutas
de primer nivel; al colgar las trece pantallas de un padre de ruta vacía, dejó de verlas y la
prueba siguió en verde sin mirar nada. Ahora recorre las hijas.

---

## 4. Lo que NO funciona todavía, y se dice en la interfaz

Ninguna pantalla finge. Cada acción sin respaldo va **deshabilitada y con su explicación al
lado**, en vez de oculta o —peor— aparentando funcionar:

| Acción | Por qué no | Condición de salida |
|---|---|---|
| Reproducir vídeo | No hay proveedor de streaming (decisión pendiente 3) | El `<img>` pasa a `<video>` con HLS y URL firmada |
| Ir a pagar, comprar, cambiar de plan | El webhook es la única fuente de verdad del pago (no negociable 3) | Módulo `pagos` |
| Canjear un código de regalo | Escribe en `acceso_recurso`, y eso solo lo hace el backend (no negociable 2) | Módulo `acceso` |
| Descargar recursos y certificado en PDF | Los archivos no existen en almacenamiento | Fase 2 |
| Buscador, comentarios, reservar taller | No hay endpoint | Cuando exista |
| Guardar el perfil | No hay `PUT /yo` | Módulo `identidad` |

El reproductor lleva además un rótulo visible: «Vista previa · el vídeo aún no está conectado».

**Lo que sí funciona de verdad hoy:** el tema y su persistencia, el carrito completo (cantidades,
subtotal, envío gratis desde $300.000, persistencia), las preferencias de Ajustes, el simulador
sincronizado con el tiempo y con el BPM, los filtros de todas las pantallas, el flujo de regalo
con su vista previa en vivo, y el cambio de contraseña del perfil — que ya existía y sigue
hablando con `POST /api/acceso/contrasena`.

---

## 5. Verificación

```bash
cd frontend && npm test
```

302 pruebas en verde. Cobertura: **93,4 % de líneas, 93,3 % de sentencias, 86,6 % de funciones,
94,8 % de ramas** — por encima de los umbrales de la regla 10.

```bash
cd frontend && npm run lint && npx ng build
```

Sin errores ni avisos.

**No se pudo verificar visualmente en el navegador.** La vista previa de esta sesión fija el
origen y descarta la ruta, así que `/inicio` y las demás no se pueden abrir desde aquí. En su
lugar, `app.routes.spec.ts` navega de verdad a las trece rutas y comprueba que sale la pantalla
correcta dentro del armazón. **Queda pendiente una revisión visual con el propietario**, sobre
todo de la portada en tema oscuro, que es la variante que nadie diseñó.

---

## 6. Qué falta

- Revisión visual de las trece pantallas y de la portada oscura.
- Renombrar los alias de token heredados (`--adr-color-tinta` y compañía) a los nombres
  semánticos, en un cambio propio y aislado.
- El riel de iconos de 84 px para tablet: el handoff aprueba las dos formas y se eligió la barra
  inferior, que resuelve tablet y móvil con una sola pieza.
- Material real: fotos de producto, miniaturas por lección y pistas de digitación de verdad. Hoy
  hay una sola pista de ejemplo repetida en bucle.
