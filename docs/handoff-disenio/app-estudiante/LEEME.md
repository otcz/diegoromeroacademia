# Handoff de la aplicación del estudiante — estado de implementación

**Recibido:** 2026-08-16 · **Implementado:** 2026-08-16

Este paquete lo entregó el propietario con las trece pantallas que hay tras iniciar sesión, más
la revisión del login. `README.md` e `INSTRUCCIONES.md` son los originales, **sin tocar**.

Los `.dc.html` de `prototipos/` son **referencias de diseño**, no código de producción. Se abren
en el navegador para medir valores exactos. `support.js` e `image-slot.js` son runtime del
entorno de prototipado y no van a producción.

---

## Qué se implementó y dónde

| # | Pantalla del handoff | Ruta real | Código |
|---|---|---|---|
| 1 | Login | `/acceso` | Ya existía. Se conserva |
| 2 | Inicio | `/inicio` | `funcionalidades/inicio/` |
| 3 | Mis cursos | `/mis-cursos` | `funcionalidades/mis-cursos/` |
| 4 | Zona Ejercicios | `/practica` | `funcionalidades/practica/practica.*` |
| 5 | Ejercicio guiado | `/practica/:id` | `funcionalidades/practica/ejercicio-guiado.*` |
| 6 | Clase | `/clase/:id` | `funcionalidades/clase/` |
| 7 | Tutoriales | `/tutoriales` | `funcionalidades/tutoriales/tutoriales.*` |
| 8 | Ver tutorial | `/tutoriales/:id` | `funcionalidades/tutoriales/ver-tutorial.*` |
| 9 | Tienda | `/tienda` | `funcionalidades/tienda/` |
| 10 | Regalar | `/regalar` | `funcionalidades/regalar/` |
| 11 | Mi suscripción | `/suscripcion` | `funcionalidades/suscripcion/` |
| 12 | Mi perfil | `/perfil` | `funcionalidades/perfil/` |
| 13 | Ajustes | `/ajustes` | `funcionalidades/ajustes/` |
| 14 | Certificado | `/certificados/:id` | `funcionalidades/certificado/` |

Las rutas no son las «sugeridas» del handoff: manda la especificación donde ya definía una.
Ver [ADR 0013](../../adr/0013-rutas-de-la-aplicacion-del-estudiante.md).

---

## En qué se apartó de la maqueta, y por qué

| Del handoff | Lo implementado | Razón |
|---|---|---|
| Tipografía Archivo | Bricolage Grotesque + Instrument Sans | Decisión del propietario: se conserva lo definido |
| Iconos de trazo (Lucide) | Phosphor duotone | Regla 12 y ADR 0005. Tabla de equivalencias en `docs/04 §2` |
| 11 escalones de texto, 7 de borde | 5 y 3 | Once niveles no son jerarquía; el segundo acaba usándose por accidente |
| `#8b90ad` texto atenuado (claro) | `#5f6f86` | 3,1:1 no llega al 4,5 de `docs/04 §5` |
| Blanco 45 % texto atenuado (oscuro) | Blanco 50 % | 4,40:1 falla por cuatro centésimas |
| `#0b8f5a` verde de estado (claro) | `#0a7d4f` | 4,12:1 en tinta de chip, que se lee |
| Riel de iconos de 84 px en tablet | Barra inferior también en tablet | El handoff aprueba ambas; una sola pieza resuelve tablet y móvil |
| Carrito como columna en la tienda | Solo panel lateral | Una segunda copia sería otra implementación del subtotal y el envío |
| «Inicia sesión» visible en el login | Oculto para lectores de pantalla | Lo pidió el propietario antes de este handoff; se respeta |

El resto —estructura, copys, medidas, comportamientos, puntos de quiebre— sigue el handoff.

---

## Material que sigue faltando

Lo que el propio README del handoff lista como pendiente, y sigue pendiente:

- Fotos de producto de la tienda. Hoy se dibuja el marcador del sistema.
- Logotipo con fondo transparente. El actual va recortado en círculo sobre negro.
- Miniaturas reales por lección y tutorial. Hoy se reutiliza la foto del artista.
- **Pistas de digitación (`fingering[]`) por lección.** Hay una sola de ejemplo, repetida en
  bucle. Es lo que más limita al simulador: sin pistas reales, el diferenciador del producto
  enseña siempre lo mismo.
- Textos legales, precios definitivos y política de renovación.

El detalle de qué funciona y qué está deshabilitado a propósito está en
[`docs/procesos/frontend-app-del-estudiante.md`](../../procesos/frontend-app-del-estudiante.md).
