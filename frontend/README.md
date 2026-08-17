# Frontend — Academia Diego Romero

Angular 21 · TypeScript `strict` · SCSS · Vitest
Sistema visual «Azul rey» ([docs/04](../docs/04-frontend-y-componentes.md)).

**Estado: verificado.** Compila, pasa el linter y las 33 pruebas con 100% de cobertura.

---

## Comandos

```bash
npm start
```

```bash
npm test
```

`npm test` corre las pruebas **con cobertura** y falla bajo el umbral (80% líneas,
sentencias y funciones; 75% ramas).

```bash
npm run lint
```

```bash
npm run build
```

Regenerar el registro de iconos tras añadir uno a `scripts/generar-iconos.mjs`:

```bash
npm run iconos:generar
```

---

## Estructura

```
src/
├── index.html            carga las fuentes del sistema visual
├── main.ts
├── entornos/             entorno.ts (prod) · entorno.desarrollo.ts
└── app/
    ├── app.ts · app.config.ts · app.routes.ts
    ├── nucleo/           servicios singleton, interceptores, guardas, modelos de API
    ├── compartido/
    │   └── componentes/  catálogo reutilizable
    ├── disenio/          _tokens.scss · _mixins.scss · global.scss · iconos/
    └── funcionalidades/  una carpeta por pantalla
```

---

## Catálogo de componentes

Construidos y probados:

| Componente | Selector | Qué cubre |
|---|---|---|
| Icono | `<adr-icono>` | Material Symbols Rounded, 20/24/32/40 px, `currentColor` |
| Botón | `<adr-boton>` | primario · secundario · fantasma · sobre-oscuro · peligro |
| Etiqueta | `<adr-etiqueta>` | tintes azul · mango · verde · neutro |
| Barra de progreso | `<adr-barra-progreso>` | valor recortado a 0–100, accesible |
| Modal | `<adr-modal>` | anatomía fija de tres zonas, Esc, foco atrapado |

Pendientes del catálogo de [docs/04 §3](../docs/04-frontend-y-componentes.md): panel lateral,
tarjeta, campo, select, casilla, interruptor, avatar, alerta, tabla, paginador, pestañas,
migas, estado vacío, esqueleto de carga, y los componentes de dominio (tarjeta de curso,
tarjeta de plan, ítem de nivel, dificultad, WhatsApp flotante).

**Se construyen cuando una pantalla los necesita, no antes** — pero siempre en el catálogo,
nunca dentro de la pantalla (regla 11).

---

## Reglas que impone el proyecto

- **Prefijo `adr-`** en todo componente; `adrAlgo` en directivas. Lo verifica ESLint.
- **`any` prohibido.** Si no se conoce el tipo, `unknown` y se estrecha.
- **`OnPush` obligatorio** en todo componente.
- **Zoneless**: no hay `zone.js`. Todo estado que deba redibujar vive en un signal.
- **Ningún color, radio ni sombra literal.** Todo sale de `disenio/_tokens.scss` (regla 15).
- **Ningún `<svg>` suelto** en una plantilla: los iconos entran por `<adr-icono>` (regla 12).
- Límites de tamaño: 400 líneas por archivo, 40 por función, 4 parámetros, complejidad 10.

---

## Añadir un icono

1. Buscarlo en [fonts.google.com/icons](https://fonts.google.com/icons), estilo **Rounded**.
2. Añadir la pareja `nombre-del-proyecto: 'nombre_material'` al mapa `ICONOS_USADOS` de
   `scripts/generar-iconos.mjs`.
3. `npm run iconos:generar`.

Si el nombre de Google no existe, el script falla en vez de generar un hueco silencioso. Solo
se empaquetan los iconos de la lista.

**Por qué el mapa tiene dos columnas.** La izquierda es el vocabulario del proyecto —lo que
escriben las plantillas— y la derecha, el nombre que le da Google. Ese desacople es lo que
permitió cambiar de Phosphor a Material Symbols tocando un archivo y no las cien plantillas
que consumen iconos ([ADR 0014](../docs/adr/0014-iconografia-material-symbols.md)).
