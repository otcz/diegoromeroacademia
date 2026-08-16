# ADR 0009 — Contraste AA de las tintas de texto

- **Estado:** propuesto
- **Fecha:** 2026-08-15
- **Decide:** Tomás (implementación) · **Aprueba:** Diego (sistema visual)
- **Sustituye a:** nada. Ajusta un valor de [`docs/04 §1`](../04-frontend-y-componentes.md)

---

## Contexto

`docs/04-frontend-y-componentes.md §5` exige, literalmente, **contraste WCAG AA mínimo: 4.5:1
en texto normal y 3:1 en texto grande**. Y `docs/04 §1` dice que los valores del sistema
visual son finales: **no se proponen colores nuevos sin un ADR**. Este ADR existe porque las
dos reglas entraron en conflicto — cumplir la primera obliga a mover un valor de la segunda.

La medición se hizo sobre la página viva en `https://diegoromeroacademia.com` el 2026-08-15,
recorriendo cada nodo de texto, componiendo el fondo real apilando ancestros y mezclando
alfa, y aplicando la fórmula de luminancia relativa de WCAG 2.1.

**Resultado: 22 pares de texto y fondo por debajo de AA.** Los mismos 22 a 375 px y a
1280 px — es un valor de token, no depende del ancho de pantalla.

Los 22 salen de **dos** colores, no de 22 descuidos:

| Tinta | Valor | Sobre | Ratio | Falla |
|---|---|---|---|---|
| `--adr-color-texto-atenuado` | `#6e7e92` | blanco | **4,15:1** | 17 casos |
| `--adr-color-texto-atenuado` | `#6e7e92` | niebla `#f6f8fb` | **3,90:1** | |
| `--adr-color-azul-rey` como TEXTO | `#1d6bf3` | niebla | **4,44:1** | 5 casos |
| `--adr-color-azul-rey` como TEXTO | `#1d6bf3` | tinte azul `#e3edfe` | **4,00:1** | |

Lo que quedaba ilegible **no es decoración**. Es «Seguidores, del canal
@DiegoRomeroAcordeon», «2 tutoriales disponibles hoy», «Precios provisionales en COP», el
`/mes` y el `/año` de las tarjetas de precio, y los cuatro kickers que rotulan las secciones.
Es exactamente la letra pequeña que sostiene la honestidad de la página y explica el modelo
de negocio.

---

## Decisión

**Tres cambios de una línea. Ningún componente se toca.**

### 1. Oscurecer el gris de metadatos

```
--adr-color-texto-atenuado: #6e7e92  →  #5f6f86
```

| | Antes | Después |
|---|---|---|
| Sobre blanco | 4,15:1 ❌ | **5,12:1** ✅ |
| Sobre niebla `#f6f8fb` | 3,90:1 ❌ | **4,81:1** ✅ |

Resuelve 17 de los 22.

Se comprobó que el token **solo se consume sobre superficies claras**: sus 19 usos
(barra-progreso, campo, cita-verificada, dato, item-nivel, modal, nav-publica, tarjeta-curso,
tarjeta-plan, acceso, catálogo, cifras, nivel y dos reglas globales) están todos sobre blanco
o niebla. Sobre fondo oscuro se usa `--adr-texto-claro`, que no se toca.

### 2. El kicker azul usa la tinta de texto, no la de acción

```
.adr-kicker--azul  →  var(--adr-tinte-azul-texto)   // #134bb8, ya aprobado
```

4,44:1 → **6,97:1**. No es un color nuevo: es un token que ya existe en el sistema.

### 3. La píldora de repetición usa el par completo de su tinte

```
.camino__repeticion  →  var(--adr-tinte-azul-texto)
```

4,00:1 → **6,29:1**. Es además el emparejamiento que `docs/04 §1` ya declara:
`--adr-tinte-azul-fondo` va con `--adr-tinte-azul-texto`. La píldora usaba el fondo de un par
con la tinta del otro.

---

## Alternativas consideradas

**Reutilizar `--adr-color-texto-secundario` (`#4a5a6e`) para los metadatos.** Cumple AA de
sobra (7,05:1 sobre blanco) y **no exige ningún valor nuevo**, así que no haría falta este
ADR. Se descartó porque aplana el escalón entre párrafo y metadato, y ese escalón es lo que
hace legible la jerarquía dentro de una tarjeta: precio, descripción y metadatos dejarían de
distinguirse por peso visual.

`#5f6f86` conserva el escalón — sigue siendo claramente más claro que el secundario — y cruza
el umbral. Es el mínimo movimiento que cumple.

**Si Diego prefiere no introducir un valor fuera del handoff**, la salida es usar `#4a5a6e` y
archivar este ADR como rechazado. Es una línea.

**Subir el tamaño de esos textos a 18 px** para acogerse al umbral de 3:1 de texto grande.
Descartado: rompe la escala tipográfica aprobada en catorce sitios y engorda la página para
esquivar la regla en vez de cumplirla.

---

## Consecuencias

- **A favor:** la página cumple el mínimo que su propia documentación exige. Deja de ser un
  requisito escrito e incumplido. Beneficia a cualquiera leyendo con luz de sol en un celular,
  que es el contexto real de este público.
- **A favor:** se corrige en dos tokens en vez de en 22 sitios, así que no puede desincronizarse.
- **En contra:** `#5f6f86` no está en el handoff de diseño aprobado. Queda registrado aquí y
  hay que llevarlo a la fuente de diseño para que no vuelva a divergir.
- **Neutro:** ningún cambio de maquetación. Las 166 pruebas siguen en verde.

## Qué queda fuera

El contraste del héroe y los anillos de foco **no entran** en este ADR: medidos entre 17,02 y
17,77:1 en siete puntos del H1 sobre la foto, y el `:focus-visible` cumple en los 15 controles.
Ya cumplen.
